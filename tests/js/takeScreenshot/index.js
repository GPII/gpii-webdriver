/*

    Test the "takeScreenshot" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-webdriver");
fluid.webdriver.loadTestingSupport();

var jqUnit = require("node-jqunit");

fluid.registerNamespace("fluid.tests.webdriver.takeScreenshot");
fluid.tests.webdriver.takeScreenshot.examineResults = function (data) {
    jqUnit.assertTrue("There should be image data...", data.length > 0);

    fluid.test.webdriver.saveScreenshot(data);
};


fluid.defaults("fluid.tests.webdriver.takeScreenshot.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    fileUrl: "%fluid-webdriver/tests/js/takeScreenshot/html/takeScreenshot.html",
    rawModules: [{
        name: "Testing the driver's `takeScreenshot` function...",
        tests: [
            {
                name: "Take a screenshot and examine the results...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.takeScreenshot",
                        args:     []
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onTakeScreenshotComplete",
                        listener: "fluid.tests.webdriver.takeScreenshot.examineResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.webdriver.takeScreenshot.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.webdriver.takeScreenshot.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.webdriver.takeScreenshot.environment" });
