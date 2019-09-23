/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./src/js/webdriver");

fluid.module.register("gpii-webdriver", __dirname, require);

// Provide a function to optionally load test support.
fluid.registerNamespace("gpii.webdriver");
gpii.webdriver.loadTestingSupport = function () {
    require("./src/tests/allBrowsers");
    require("./src/tests/fixtures");
    require("./src/tests/helper-functions");
    require("./src/tests/resolve-file-url");
    var kettle = require("kettle");
    kettle.loadTestingSupport();
};

module.exports = gpii.webdriver;
