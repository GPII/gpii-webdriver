// TODO: These fail with Firefox 57 and geckodriver 0.18.0
/*

    Test mouse clicks.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.registerNamespace("fluid.tests.webdriver.actions.text");

fluid.tests.webdriver.actions.text.getRadioButtonValue = function () {
    return document.sampleForm.color.value;
};

fluid.defaults("fluid.tests.webdriver.actions.text.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/actions/html/click.html",
    rawModules: [{
        name: "Testing mouse 'click' input...",
        tests: [
            {
                name: "Click a radio button...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [fluid.webdriver.By.id("red-button")]
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
                        args:     [fluid.tests.webdriver.actions.text.getRadioButtonValue]
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

fluid.defaults("fluid.tests.webdriver.actions.text.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.actions.text.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.actions.text.environment" });
