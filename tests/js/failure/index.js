/*

    Test the failure modes for the webdriver component itself.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.webdriver.failure");

// A test fixture which will claim that it's ready even though it has not been initialized properly.
fluid.defaults("gpii.tests.webdriver.failure.bornToLose", {
    gradeNames: ["gpii.webdriver"],
    listeners: {
        "onCreate.init": {
            func: "{that}.events.onDriverReady.fire"
        }
    }
});

fluid.defaults("gpii.tests.webdriver.failure.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder.base"],
    fileUrl: "%gpii-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's failure modes...",
        tests: [
            {
                name: "Try to execute a function when the driver does not exist...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.events.constructFixtures.fire"
                    },
                    {
                        event: "{testEnvironment}.events.onFixturesConstructed",
                        listener: "fluid.identity"
                    },
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["http://www.google.com/"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onError",
                        listener: "jqUnit.assert",
                        args:     ["An error should have been thrown..."]
                    },
                    {
                        func: "{testEnvironment}.webdriver.quit"
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.failure.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        webdriver: {
            type: "gpii.tests.webdriver.failure.bornToLose"
        },
        caseHolder: {
            type: "gpii.tests.webdriver.failure.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.failure.environment" });
