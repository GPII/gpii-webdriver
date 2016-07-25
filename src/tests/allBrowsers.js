/* eslint-env node */
// Run the tests in a range of browsers based on the platform or the supplied options
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var os    = require("os");

fluid.registerNamespace("gpii.test.webdriver.allBrowsers");

// TODO:  Add the ability to run various versions of IE

// TODO:  Document the order of precedence for browser settings.
gpii.test.webdriver.allBrowsers.runTests = function (that) {
    var browsers = that.options.browsers || gpii.test.webdriver.allBrowsers.getPlatformBrowsers(that);

    if (process.env.BROWSERS) {
        browsers = process.env.BROWSERS.split(/[, ]/)
    }

    fluid.each(browsers, function (browser) {
        var gradeName = that.options.baseTestEnvironment + "." + browser;

        fluid.defaults(gradeName, {
            gradeNames: ["gpii.test.webdriver.allBrowsers.testEnvironment", that.options.baseTestEnvironment],
            browser: browser
        });

        fluid.test.runTests(gradeName);
    });
};

gpii.test.webdriver.allBrowsers.getPlatformBrowsers = function (that) {
    var platform = os.platform();
    return that.options.defaultPlatformBrowsers[platform];
};

fluid.registerNamespace("gpii.test.webdriver.allBrowsers");

gpii.test.webdriver.allBrowsers.setBrowser = function (browser) {
    process.env.SELENIUM_BROWSER = browser;
};

fluid.defaults("gpii.test.webdriver.allBrowsers.testEnvironment", {
    gradeNames: ["fluid.component"],
    listeners: {
        "onCreate.setBrowser": {
            funcName: "gpii.test.webdriver.allBrowsers.setBrowser",
            args:     ["{that}.options.browser"]
        }
    }
});

fluid.defaults("gpii.test.webdriver.allBrowsers", {
    gradeNames: ["fluid.component"],
    defaultPlatformBrowsers: {
        aix:     ["firefox"],
        darwin:  ["firefox", "chrome"],
        freebsd: ["firefox"],
        linux:   ["firefox", "chrome"],
        openbsd: ["firefox"],
        sunos:   ["firefox"],
        win32:   ["firefox", "chrome", "ie", "edge"]
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.webdriver.allBrowsers.runTests",
            args:     ["{that}"]
        }
    }
});
