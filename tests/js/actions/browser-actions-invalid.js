/*

    Test the invalid modes of the actions endpoint.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.actions.invalid.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/actions/html/tabs.html",
    rawModules: [{
        name: "Test the action helper with an invalid action...",
        tests: [
            {
                name: "Attempt to execute a non-existent action...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [[{ fn: "bogus", args:[] }]]
                    },
                    {
                        event: "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "jqUnit.assert",
                        args: ["Action completed."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.actions.invalid.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.actions.invalid.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.actions.invalid.environment" });
