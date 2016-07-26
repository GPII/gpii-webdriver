/*

    Confirm that the `syncInit` version of the grade also work with IoC tests.

 */
/*

 Test the "isElementPresent" function with all functions provided by `gpii.webdriver.By`.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.syncInit.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder.base"],
    fileUrl: "%gpii-webdriver/tests/js/findElement/html/index.html",
    rawModules: [{
        name: "Testing the `syncInit` driver in Fluid IoC tests...",
        tests: [
            {
                name: "Confirm that a startup event is fired...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.events.constructFixtures.fire"
                    },
                    {
                        event:    "{testEnvironment}.events.onFixturesConstructed",
                        listener: "jqUnit.assert",
                        args:     ["A startup event should have been fired..."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.syncInit.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.syncInit.caseHolder"
        },
        webdriver: {
            // Use the "synchronous" version of the grade
            type: "gpii.webdriver.syncInit"
        }
    }
});

gpii.test.webdriver.allBrowsers({
    baseTestEnvironment: "gpii.tests.webdriver.syncInit.environment"
});
