Package.describe({
  name: "twisterking:impersonate",
  summary: "Impersonate users in Meteor",
  version: "0.3.1",
  git: "https://github.com/gwendall/meteor-impersonate.git",
});

Package.onUse(function (api, where) {

  api.use([
    "accounts-base@1.2.2",
    "reactive-var@1.0.6",
    "tracker"
  ], "client");

  api.use([
    "random@1.0.5",
    "alanning:roles@1.2.14",
  ]);

  api.addFiles([
    "server/lib.js"
  ], "server");

  api.addFiles([
    "client/lib.js"
  ], "client");

  api.export("Impersonate");

});
