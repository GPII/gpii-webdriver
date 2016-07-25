/*

    Test the "takeScreenshot" function.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var path = require("path");
var fs = require("fs");
var os = require("os");

require("../../../");
gpii.webdriver.loadTestingSupport();

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.webdriver.takeScreenshot");
gpii.tests.webdriver.takeScreenshot.examineResults = function (data) {
    jqUnit.assertTrue("There should be image data...", data.length > 0);

    // Save the image to a file so that we can manually examine it.
    var filePath = path.resolve(os.tmpdir(), "screenshot-" + Date.now() + ".png");
    fs.writeFileSync(filePath, new Buffer(data, "base64"));
    console.log("Screenshot saved to '" + filePath + "'...");
};


fluid.defaults("gpii.tests.webdriver.takeScreenshot.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    fileUrl: "%gpii-webdriver/tests/js/takeScreenshot/html/takeScreenshot.html",
    rawModules: [{
        name: "Testing the driver's `takeScreenshot` function...",
        tests: [
            {
                name: "Take a screenshot and examine the results...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:gpii.test.webdriver.resolveFileUrl({that}.options.fileUrl)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.takeScreenshot",
                        args:     []
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onTakeScreenshotComplete",
                        listener: "gpii.tests.webdriver.takeScreenshot.examineResults",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.webdriver.takeScreenshot.environment", {
    gradeNames: ["gpii.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.webdriver.takeScreenshot.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironent: "gpii.tests.webdriver.takeScreenshot.environment" });
