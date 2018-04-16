Impersonate = {
  _user: null, 
  _token: null,
  _active: new ReactiveVar(false),
};

Impersonate.isActive = function(){
  return Impersonate._active.get();
};

// Impersonate.isAdmin = function() {
//   console.log('this._user,', this._user,);
//   return Roles.userIsInRole(this._user, 'admin')
// };

Impersonate.do = function(toUser, cb) {
  var params = { toUser: toUser };
  if (Impersonate._user) {
    params.fromUser = Impersonate._user;
    params.token = Impersonate._token;
  }

  Meteor.call("impersonate", params, function(err, res) {
    if (err) {
      console.log("Could not impersonate.", err);
      if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, res]);
    }
    else {
      if (!Impersonate._user) {
        Impersonate._user = res.fromUser; // First impersonation
        Impersonate._token = res.token;
        try {
          Object.defineProperty(Impersonate, "_byAdmin", {
            configurable: false,
            writable: false,
            enumerable: true,
            value: Roles.userIsInRole(Impersonate._user, 'admin')
          });
        } catch(err) {
          alert('Due to security reasons, the page has to be reloaded first! Please wait ...');
          location.reload();
        }
      }
      Impersonate._active.set(true);
      Meteor.connection.setUserId(res.toUser);
      if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, res.toUser]);
    }
  });
}

Impersonate.undo = function(cb) {
  Impersonate.do(Impersonate._user, function(err, res) {
    if (err) {
      if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, res]);
    }
    else {
      Impersonate._active.set(false);
      if (!!(cb && cb.constructor && cb.apply)) cb.apply(this, [err, res.toUser]);
    }
  });
}

// Reset data on logout
Meteor.autorun(function() {
  if (Meteor.userId()) return;
  Impersonate._active.set(false);
  Impersonate._user = null;
  Impersonate._token = null;
});