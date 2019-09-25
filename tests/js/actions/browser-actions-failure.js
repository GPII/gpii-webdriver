/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

require("../lib/globalErrorHandler");

fluid.defaults("gpii.tests.webdriver.actions.failure.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/actions/html/tabs.html",
    rawModules: [{
        name: "Test the failure modes of the action helper...",
        tests: [
            {
                name: "Attempt to execute a non-existent action...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        funcName: "gpii.test.webdriver.pushInstrumentedErrors"
                    },
                    // This will result in a global error.
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "bogus", args:[] }]
                    },
                    {
                        event: "{gpii.test.webdriver.globalFailureHandler}.events.onError",
                        listener: "gpii.test.webdriver.awaitGlobalFailure"
                    },
                    {
                        funcName: "kettle.test.popInstrumentedErrors"
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.actions.failure.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.actions.failure.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.actions.failure.environment" });
