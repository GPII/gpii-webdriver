/*

    Test the "getCurrentUrl" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.getCurrentUrl.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `getCurrentUrl` function...",
        tests: [
            {
                name: "Get the current URL...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.getCurrentUrl",
                        args:     []
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetCurrentUrlComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The URL should be as expected...", "@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)", "{arguments}.0"]
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

gpii.test.webdriver.allBrowsers({ baseTestEnvironent: "gpii.tests.webdriver.getCurrentUrl.environment" });
