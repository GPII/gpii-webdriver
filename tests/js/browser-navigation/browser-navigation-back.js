/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

fluid.defaults("fluid.tests.webdriver.navigation.browser.back.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    startUrl: "%fluid-webdriver/tests/js/browser-navigation/html/first.html",
    secondUrl: "%fluid-webdriver/tests/js/browser-navigation/html/second.html",
    rawModules: [{
        name: "Testing the browser's `back` button...",
        tests: [
            {
                name: "Use the browser's back button to return to a previous page...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.startUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.navigateHelper",
                        args:     ["to", "@expand:fluid.test.webdriver.resolveFileUrl({that}.options.secondUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.navigateHelper",
                        args:     ["back"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onNavigateHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ id: "first-body"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.test.webdriver.inspectElement",
                        args:     ["We should be back on the first page...", "{arguments}.0", "getText", "This is the first page."] // message, element, elementFn, expectedValue, jqUnitFn
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.navigation.browser.back.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.navigation.browser.back.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.navigation.browser.back.environment" });
