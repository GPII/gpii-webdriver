/*

    Test the "findElement" function with a bad selector.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

require("../lib/globalErrorHandler");

fluid.defaults("fluid.tests.webdriver.findElement.notFound.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/findElement/html/index.html",
    rawModules: [{
        name: "Testing the driver's `findElement` function (single)...",
        tests: [
            {
                name: "Retrieve a single element...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "fluid.test.webdriver.pushInstrumentedErrors"
                    },
                    // This will result in a global error.
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ id: "notfound"}]
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

fluid.defaults("fluid.tests.webdriver.findElement.notFound.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.findElement.notFound.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.findElement.notFound.environment" });
