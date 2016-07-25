/*

    Test the "executeScript" function with a very simple client-side function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.webdriver.executeScript.args");
gpii.tests.webdriver.executeScript.args.getAttr = function (attr) {
    return document[attr];
};

fluid.defaults("gpii.tests.webdriver.executeScript.args.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `executeScript` function with arguments...",
        tests: [
            {
                name: "Retrieve the title using a function (with arguments)...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.tests.webdriver.executeScript.args.getAttr, "title"]
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

fluid.defaults("gpii.tests.webdriver.executeScript.args.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.executeScript.args.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironent: "gpii.tests.webdriver.executeScript.args.environment" });
