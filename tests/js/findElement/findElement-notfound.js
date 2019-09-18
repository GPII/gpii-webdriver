/*

    Test the "findElement" function with a bad selector.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

require("../lib/globalErrorHandler");

fluid.defaults("gpii.tests.webdriver.findElement.notFound.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/findElement/html/index.html",
    rawModules: [{
        name: "Testing the driver's `findElement` function (single)...",
        tests: [
            {
                name: "Retrieve a single element...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "kettle.test.pushInstrumentedErrors",
                        args: "gpii.test.webdriver.notifyGlobalFailure"
                    },
                    // This will result in a global error.
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ id: "notfound"}]
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

fluid.defaults("gpii.tests.webdriver.findElement.notFound.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.findElement.notFound.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.findElement.notFound.environment" });
