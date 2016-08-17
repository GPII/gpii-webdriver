/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.actions.failure.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/actions/html/tabs.html",
    rawModules: [{
        name: "Test the failure modes of the action helper...",
        tests: [
            {
                name: "Attempt to execute a non-existent action...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "bogus", args:[] }]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onError",
                        listener: "jqUnit.assert",
                        args:     ["An error should be thrown..."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.actions.failure.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.actions.failure.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.actions.failure.environment" });
