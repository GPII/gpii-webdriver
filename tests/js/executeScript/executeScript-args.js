/*

    Test the "executeScript" function with a very simple client-side function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.registerNamespace("fluid.tests.webdriver.executeScript.args");
fluid.tests.webdriver.executeScript.args.getAttr = function (attr) {
    return document[attr];
};

fluid.defaults("fluid.tests.webdriver.executeScript.args.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/executeScript/html/executeScript.html",
    rawModules: [{
        name: "Testing the driver's `executeScript` function with arguments...",
        tests: [
            {
                name: "Retrieve the title using a function (with arguments)...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.tests.webdriver.executeScript.args.getAttr, "title"]
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

fluid.defaults("fluid.tests.webdriver.executeScript.args.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.executeScript.args.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.executeScript.args.environment" });
