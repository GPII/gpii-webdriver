/* eslint-env node */
"use strict";
var fluid = require("infusion");
var jqUnit = require("node-jqunit");
var kettle = require("kettle");
kettle.loadTestingSupport();

fluid.defaults("fluid.test.webdriver.globalFailureHandler", {
    gradeNames: ["fluid.component", "fluid.resolveRootSingle"],
    singleRootType: "fluid.test.globalFailureHandlerHolder",
    events: {
        onError: null
    }
});

fluid.test.webdriver.awaitGlobalFailure = function () {
    jqUnit.assert("An error should have occurred.");
};

fluid.test.webdriver.pushInstrumentedErrors = function () {
    fluid.log("Getting ready to catch an expected error.");
    kettle.test.pushInstrumentedErrors("fluid.test.webdriver.notifyGlobalFailure");
};


fluid.test.webdriver.notifyGlobalFailure = function () {
    globalFailureHandler.events.onError.fire(fluid.makeArray(arguments));
};

var globalFailureHandler = fluid.test.webdriver.globalFailureHandler();
