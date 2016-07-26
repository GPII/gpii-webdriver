/*

    Test the "sleep" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();


fluid.defaults("gpii.tests.webdriver.sleep.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `sleep` function...",
        tests: [
            {
                name: "Go to sleep and confirm that the browser wakes correctly...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.sleep",
                        args:     [250]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onSleepComplete",
                        listener: "jqUnit.assert",
                        args:     ["The browser should wake up after sleeping."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.sleep.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.sleep.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.sleep.environment" });
