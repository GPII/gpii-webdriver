/*

    Test the "getCurrentUrl" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.getCurrentUrl.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    // We have to use a non-file URL because file URLs are problematic on Windows, with browser responses like:
    //
    //  * `file://C:/something`
    //  * `file:///C:/something`
    //  * `C:/something`.
    urlToLoad: "https://en.wikipedia.org/wiki/Sartor_Resartus",
    rawModules: [{
        name: "Testing the driver's `getCurrentUrl` function...",
        tests: [
            {
                name: "Get the current URL...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{that}.options.urlToLoad"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.getCurrentUrl",
                        args:     []
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetCurrentUrlComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The URL should be as expected...", "{that}.options.urlToLoad", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.getCurrentUrl.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.getCurrentUrl.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.getCurrentUrl.environment" });
