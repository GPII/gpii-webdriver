/*

    Test the "get" function with a local file.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.get.local.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/get/html/index.html",
    rawModules: [{
        name: "Testing the driver's `get` function (local)...",
        tests: [
            {
                name: "Retrieve a local page...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
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

fluid.defaults("gpii.tests.webdriver.get.local.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.get.local.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.webdriver.get.local.environment");
