/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

require("../lib/globalErrorHandler");

fluid.defaults("fluid.tests.webdriver.navigation.browser.failure.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/browser-navigation/html/first.html",
    secondFileUrl: "%fluid-webdriver/tests/js/browser-navigation/html/second.html",
    rawModules: [{
        name: "Testing the navigation helper's failure mode...",
        tests: [
            {
                name: "Attempt to use a non-existent navigation function...",
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
                        func: "{testEnvironment}.webdriver.navigateHelper",
                        args: ["bogus"]
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

fluid.defaults("fluid.tests.webdriver.navigation.browser.failure.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.navigation.browser.failure.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.navigation.browser.failure.environment" });
