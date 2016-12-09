/*

    Test the "findElement" function with a single element.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.defaults("gpii.tests.webdriver.navigation.browser.failure.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/browser-navigation/html/first.html",
    secondFileUrl: "%gpii-webdriver/tests/js/browser-navigation/html/second.html",
    rawModules: [{
        name: "Testing the navigation helper's failure mode...",
        tests: [
            {
                name: "Attempt to use a non-existant navigation function...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.navigateHelper",
                        args:     ["bogus"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onError",
                        listener: "jqUnit.assert",
                        args:     ["Calling a non-existant navigation function should result in an error..."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.navigation.browser.failure.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.navigation.browser.failure.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.webdriver.navigation.browser.failure.environment" });
