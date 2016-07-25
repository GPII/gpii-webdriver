/*

    Test the "executeScript" function with a very simple client-side function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.webdriver.executeScript.simple");
gpii.tests.webdriver.executeScript.simple.getTitle = function () {
    return document.title;
};

fluid.defaults("gpii.tests.webdriver.executeScript.simple.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `executeScript` function...",
        tests: [
            {
                name: "Retrieve a single element...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.tests.webdriver.executeScript.simple.getTitle]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The sample function should have returned the correct value...", "{arguments}.0", "script execution tests..."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.executeScript.simple.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.executeScript.simple.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironent: "gpii.tests.webdriver.executeScript.simple.environment" });
