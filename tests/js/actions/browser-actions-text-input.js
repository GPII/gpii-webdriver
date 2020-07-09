// TODO: These fail with Firefox 57 and geckodriver 0.18.0
/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.actions.text.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/actions/html/text.html",
    rawModules: [{
        name: "Testing keyboard text input...",
        tests: [
            {
                name: "Type in an array of strings in a single call to sendKeys...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [[fluid.webdriver.Key.TAB, "This is really something"]] }]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.test.webdriver.testElementValue",
                        args:     ["The text should be as entered...", "{arguments}.0", "This is really something"] // message, element, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Type in an array of strings in a multiple calls to sendKeys...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [[{fn: "sendKeys", args: [fluid.webdriver.Key.TAB]}, { fn: "sendKeys", args: ["This ", "is "]}, { fn: "sendKeys", args: ["really ", "something"]}]]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.test.webdriver.testElementValue",
                        args:     ["The text should be as entered...", "{arguments}.0", "This is really something"] // message, element, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Type in unicode...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [[{fn: "sendKeys", args: [fluid.webdriver.Key.TAB]}, { fn: "sendKeys", args: ["Կրնամ ապակի ուտել և ինծի անհանգիստ չըներ։"]}]]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.test.webdriver.testElementValue",
                        // "I can eat glass, it doesn't hurt me.", in Armenian. Taken from http://www.columbia.edu/~fdc/utf8/
                        args:     ["The text should be as entered...", "{arguments}.0", "Կրնամ ապակի ուտել և ինծի անհանգիստ չըներ։"] // message, element, expectedValue, jqUnitFn
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
