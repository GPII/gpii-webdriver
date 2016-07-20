/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.navigation.browser.forward.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/browser-navigation/html/first.html",
    secondFileUrl: "%gpii-webdriver/tests/js/browser-navigation/html/second.html",
    rawModules: [{
        name: "Testing the browser's `forward` button...",
        tests: [
            {
                name: "Use the browser's `forward` button to go to the next page in our history...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.navigate",
                        args:     ["to", "@expand:gpii.test.webdriver.resolveFileUrl({that}.options.secondFileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateComplete",
                        listener: "{testEnvironment}.webdriver.navigate",
                        args:     ["back"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateComplete",
                        listener: "{testEnvironment}.webdriver.navigate",
                        args:     ["forward"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "second-body"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.webdriver.test.inspectElement",
                        args:     ["We should be on the second page again...", "{arguments}.0", "getText", "This is the second page."] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.navigation.browser.forward.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.navigation.browser.forward.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.webdriver.navigation.browser.forward.environment");
