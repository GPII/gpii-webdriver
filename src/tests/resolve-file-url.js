/*
 A server-side (node) function that uses `fluid.module.resolvePath` to resolve File URLs relative to the location of
 this module. `path` should be something like:

 `%gpii-webdriver/tests/get/html/index.html`

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
var url   = require("url");

fluid.registerNamespace("gpii.test.webdriver");

gpii.test.webdriver.resolveFileUrl = function (path) {
    return url.resolve("file://", fluid.module.resolvePath(path));
};
