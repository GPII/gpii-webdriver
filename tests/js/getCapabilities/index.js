// TODO: These fail with all tested browsers.
/*

    Test the "getCapabilities" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.getCapabilties.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/executeScript/html/executeScript.html",
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
                        args:     ["The capabilities should at least indicate that javascript is enabled....", { javascriptEnabled: true }, "@expand:fluid.test.webdriver.mapToObject({arguments}.0)"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.getCapabilties.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.getCapabilties.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.getCapabilties.environment" });
