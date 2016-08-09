/*

    Test mouse clicks.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.webdriver.actions.text");

/* globals document */
gpii.tests.webdriver.actions.text.getRadioButtonValue = function () {
    return document.sampleForm.color.value;
};

fluid.defaults("gpii.tests.webdriver.actions.text.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/actions/html/click.html",
    rawModules: [{
        name: "Testing mouse 'click' input...",
        tests: [
            {
                name: "Click a radio button...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [gpii.webdriver.By.id("red-button")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        // We must call "click" with a specific element located in the previous call, i.e. {arguments}.0
                        args:     [[{fn: "click", args: ["{arguments}.0"]}]]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.tests.webdriver.actions.text.getRadioButtonValue]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The correct button should be selected...", "{arguments}.0", "red"] // message, element, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.actions.text.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.actions.text.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.actions.text.environment" });
