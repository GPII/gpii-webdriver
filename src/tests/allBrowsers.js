/*

    A harness to run tests in a range of browsers.  See the documentation for details:

    https://github.com/GPII/gpii-webdriver/blob/master/docs/allBrowsers.md

 */
/* eslint-env node */
// Run the tests in a range of browsers based on the platform or the supplied options
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var os    = require("os");

fluid.registerNamespace("gpii.test.webdriver.allBrowsers");

// TODO:  Add the ability to run various versions of browsers, particularly IE

/**
 *
 * A function that:
 *
 * 1. Gets the list of browsers based on that.options.browsers or the defaults for os.platform().
 * 2. Optionally overrides the list using the value of the `BROWSERS` environment variable.
 * 3. Generates a distinct test environment for each browser with the right brower option set.
 * 4. Runs each generated environment.
 *
 * @param that - The component itself.
 */
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

/**
 *
 * A function to get the list of platform browsers based on that.options.defaultPlatformBrowsers (see below) and os.platform().
 *
 * @param that
 * @returns An {Array} of {String} values, each representing a browser.
 *
 */
gpii.test.webdriver.allBrowsers.getPlatformBrowsers = function (that) {
    var platform = os.platform();
    return that.options.defaultPlatformBrowsers[platform];
};

fluid.registerNamespace("gpii.test.webdriver.allBrowsers");

/**
 *
 * Set the `SELENIUM_BROWSER` environment variable to implicitly force the webdriver instance to use the selected browser.
 *
 * @param browser {String} The browser to use.
 *
 */
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
