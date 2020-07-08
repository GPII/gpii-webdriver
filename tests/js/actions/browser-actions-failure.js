/*

    Test the failure modes of the actions endpoint.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

require("../lib/globalErrorHandler");

fluid.defaults("fluid.tests.webdriver.actions.failure.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/actions/html/tabs.html",
    rawModules: [{
        name: "Test the failure modes of the action helper...",
        tests: [
            {
                name: "Attempt to execute a non-existent action...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        funcName: "fluid.test.webdriver.pushInstrumentedErrors"
                    },
                    // This will result in a global error.
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "bogus", args:[] }]
                    },
                    {
                        event: "{fluid.test.webdriver.globalFailureHandler}.events.onError",
                        listener: "fluid.test.webdriver.awaitGlobalFailure"
                    },
                    {
                        funcName: "kettle.test.popInstrumentedErrors"
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.actions.failure.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.actions.failure.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.actions.failure.environment" });
