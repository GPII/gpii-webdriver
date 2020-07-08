/*

    Test the "getCurrentUrl" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.getCurrentUrl.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
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

fluid.defaults("fluid.tests.webdriver.getCurrentUrl.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.getCurrentUrl.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.getCurrentUrl.environment" });
