/*

    Test the "getCurrentUrl" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.getCapabilties.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Test `getCapabilities`...",
        tests: [
            {
                name: "Get the browser's capabilities...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.getCapabilities",
                        args: []
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetCapabilitiesComplete",
                        listener: "jqUnit.assertLeftHand",
                        args:     ["The capabilities should at least indicate that javascript is enabled....", { javascriptEnabled: true }, "@expand:gpii.test.webdriver.mapToObject({arguments}.0)"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.getCapabilties.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.getCapabilties.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.getCapabilties.environment" });
