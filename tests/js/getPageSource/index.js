/*

    Test the "getPageSource" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.getPageSource.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/get/html/index.html",
    rawModules: [{
        name: "Testing the driver's `getPageSource` function...",
        tests: [
            {
                name: "Retrieve a local page...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
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

fluid.defaults("fluid.tests.webdriver.getPageSource.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.getPageSource.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.getPageSource.environment" });
