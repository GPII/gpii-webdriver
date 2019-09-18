/* eslint-env node */
"use strict";
var fluid = require("infusion");
var jqUnit = require("node-jqunit");

var gpii = fluid.registerNamespace("gpii");

fluid.defaults("gpii.test.webdriver.globalFailureHandler", {
    gradeNames: ["fluid.component", "fluid.resolveRootSingle"],
    singleRootType: "gpii.test.globalFailureHandlerHolder",
    events: {
        onError: null
    }
});

fluid.registerNamespace("gpii.test.webdriver");
gpii.test.webdriver.awaitGlobalFailure = function () {
    jqUnit.assert("An error should have occurred.");
};

gpii.test.webdriver.notifyGlobalFailure = function () {
    globalFailureHandler.events.onError.fire(fluid.makeArray(arguments));
};

var globalFailureHandler = gpii.test.webdriver.globalFailureHandler();
