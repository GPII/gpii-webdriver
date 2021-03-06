/*

    Test the "get" function with an external URL.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.get.remote.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    rawModules: [{
        name: "Testing the driver's `get` function (remote)...",
        tests: [
            {
                name: "Retrieve a remote page (requires network access)...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args:     ["https://en.wikipedia.org/wiki/Jacquard_loom"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.getPageSource",
                        args:     []
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetPageSourceComplete",
                        listener: "jqUnit.assertNotUndefined",
                        args:     ["There should be page content...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.get.remote.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.get.remote.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.get.remote.environment" });
