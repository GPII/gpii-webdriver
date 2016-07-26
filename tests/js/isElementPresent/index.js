/*

    Test the "isElementPresent" function with all functions provided by `gpii.webdriver.By`.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

fluid.registerNamespace("gpii.tests.webdriver.isElementPresent");
gpii.tests.webdriver.isElementPresent.getBody = function () { return document.body; };

fluid.defaults("gpii.tests.webdriver.isElementPresent.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/findElement/html/index.html",
    rawModules: [{
        name: "Testing the driver's `isElementPresent` function...",
        tests: [
            {
                name: "Check for the presence of an element using various selectors...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.isElementPresent",
                        args:     [gpii.webdriver.By.id("single")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onIsElementPresentComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["We should be able to verify the existance of an element by its ID.", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.isElementPresent",
                        args: [gpii.webdriver.By.tagName("body")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onIsElementPresentComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["We should be able to verify the existance of an element by its tagName.", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.isElementPresent",
                        args: [gpii.webdriver.By.css("p.multiple")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onIsElementPresentComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["We should be able to verify the existance of an element using a CSS selector.", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.isElementPresent",
                        args: [gpii.webdriver.By.xpath("//p")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onIsElementPresentComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["We should be able to verify the existance of an element using an XPath selector.", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.isElementPresent",
                        args: [gpii.webdriver.By.className("multiple")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onIsElementPresentComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["We should be able to verify the existance of an element using a className.", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.isElementPresent",
                        args: [gpii.webdriver.By.linkText("Complete Link Text")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onIsElementPresentComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["We should be able to verify the existance of a link using its text.", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.isElementPresent",
                        args: [gpii.webdriver.By.partialLinkText("Link Text")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onIsElementPresentComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["We should be able to verify the existance of a link using part of its text.", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.isElementPresent",
                        args: [gpii.webdriver.By.js(gpii.tests.webdriver.isElementPresent.getBody)]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onIsElementPresentComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["We should be able to verify the existance of an element using a custom javascript function.", "{arguments}.0"]
                    },
                    {
                        func: "{testEnvironment}.webdriver.isElementPresent",
                        args: [gpii.webdriver.By.id("notfound")]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onIsElementPresentComplete",
                        listener: "jqUnit.assertFalse",
                        args:     ["An ID that does not correspond to an element should not be found.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.isElementPresent.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.isElementPresent.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({
    baseTestEnvironment: "gpii.tests.webdriver.isElementPresent.environment"
});
