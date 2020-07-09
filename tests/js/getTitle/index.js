/*

    Test the "getTitle" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.getTitle.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `getTitle` function...",
        tests: [
            {
                name: "Retrieve the title...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.getTitle",
                        args:     []
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetTitleComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The title should be correct...", "{arguments}.0", "script execution tests..."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.getTitle.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.getTitle.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.getTitle.environment" });
