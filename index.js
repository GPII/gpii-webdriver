/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("./src/js/webdriver");

fluid.module.register("fluid-webdriver", __dirname, require);

// Provide a function to optionally load test support.
fluid.registerNamespace("fluid.webdriver");
fluid.webdriver.loadTestingSupport = function () {
    require("./src/tests/allBrowsers");
    require("./src/tests/fixtures");
    require("./src/tests/helper-functions");
    require("./src/tests/resolve-file-url");
    var kettle = require("kettle");
    kettle.loadTestingSupport();
};

module.exports = fluid.webdriver;
