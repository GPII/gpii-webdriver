/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.actions.text.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/actions/html/text.html",
    rawModules: [{
        name: "Testing keyboard text input...",
        tests: [
            {
                name: "Type in a single string...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: ["This is really something"] }]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.webdriver.test.testElementValue",
                        args:     ["The text should be as entered...", "{arguments}.0", "This is really something"] // message, element, expectedValue, jqUnitFn
                    }
                ]
            },
            {
                name: "Type in an array of strings in a single call to sendKeys...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: ["This ", "is ", "really ", "something"]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.webdriver.test.testElementValue",
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
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [[{ fn: "sendKeys", args: ["This ", "is "]}, { fn: "sendKeys", args: ["really ", "something"]}]]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "text-field"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.webdriver.test.testElementValue",
                        args:     ["The text should be as entered...", "{arguments}.0", "This is really something"] // message, element, expectedValue, jqUnitFn
                    }
                ]
            },
            // {
            //     name: "Type in unicode...",
            //     type: "test",
            //     sequence: [
            //         {
            //             func: "{testEnvironment}.webdriver.get",
            //             args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onGetComplete",
            //             listener: "{testEnvironment}.webdriver.actionsHelper",
            //             // "I can eat glass, it doesn't hurt me.", in Armenian. Taken from http://www.columbia.edu/~fdc/utf8/
            //             args:     [{ fn: "sendKeys", args: ["Կրնամ ապակի ուտել և ինծի անհանգիստ չըներ։"]}]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
            //             listener: "{testEnvironment}.webdriver.findElement",
            //             args:     [{ id: "text-field"}]
            //         },
            //         {
            //             event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
            //             listener: "gpii.webdriver.test.testElementValue",
            //             args:     ["The text should be as entered...", "{arguments}.0", "Կրնամ ապակի ուտել և ինծի անհանգիստ չըներ։"] // message, element, expectedValue, jqUnitFn
            //         }
            //     ]
            // }
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
