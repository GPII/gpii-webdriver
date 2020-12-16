/*

    A harness to run tests in a range of browsers.  See the documentation for details:

    https://github.com/fluid-project/fluid-webdriver/blob/main/docs/allBrowsers.md

 */
/* eslint-env node */
// Run the tests in a range of browsers based on the platform or the supplied options
"use strict";
var fluid = require("infusion");
var os    = require("os");

fluid.registerNamespace("fluid.test.webdriver.allBrowsers");

/**
 *
 * A function that:
 *
 * 1. Gets the list of browsers based on that.options.browsers or the defaults for os.platform().
 * 2. Optionally overrides the list using the value of the `BROWSERS` environment variable.
 * 3. Generates a distinct test environment for each browser with the right brower option set.
 * 4. Runs each generated environment.
 *
 * @param {fluid.test.webdriver.allBrowsers} that - The component itself.
 */
fluid.test.webdriver.allBrowsers.runAllTests = function (that) {
    var browsers = fluid.test.webdriver.allBrowsers.getBrowsers(that);

    fluid.each(browsers, function (browser) {
        that.runTestsInSingleBrowser(browser);
    });
};

fluid.test.webdriver.allBrowsers.generateAndRunTestEnvironment = function (that, browser) {
    var gradeName = that.options.baseTestEnvironment + "." + browser;

    fluid.defaults(gradeName, {
        gradeNames: ["fluid.test.webdriver.allBrowsers.testEnvironment", that.options.baseTestEnvironment],
        browser: browser
    });

    fluid.test.runTests(gradeName);
};

/**
 *
 * A function to get the list of browsers we want to test.  In order of precedence, this looks at:
 *
 * 1. The `BROWSERS` environment variable.
 * 2. `that.options.browsers`
 * 3. The default list of browsers for the current platform.
 *
 * @param {fluid.test.webdriver.allBrowsers} that - The component itself.
 * @return {Array<String>} - An array of supported browser names.
 *
 */
fluid.test.webdriver.allBrowsers.getBrowsers = function (that) {
    if (process.env.BROWSERS) {
        return process.env.BROWSERS.split(/[, ]/);
    }
    else {
        return that.options.browsers || fluid.test.webdriver.allBrowsers.getPlatformBrowsers();
    }
};

/**
 *
 * A function to get the list of platform browsers based on `fluid.test.webdriver.allBrowsers.defaultPlatformBrowsers`
 * (see below) and `os.platform()`.
 *
 * @return {Array<String>} An array of strings, each representing a browser.
 *
 */
fluid.test.webdriver.allBrowsers.getPlatformBrowsers = function () {
    var platform = os.platform();
    return fluid.test.webdriver.allBrowsers.defaultPlatformBrowsers[platform];
};

fluid.registerNamespace("fluid.test.webdriver.allBrowsers");

/**
 *
 * Set the `SELENIUM_BROWSER` environment variable to implicitly force the webdriver instance to use the selected browser.
 *
 * @param {String} browser The browser to use.
 *
 */
fluid.test.webdriver.allBrowsers.setBrowser = function (browser) {
    process.env.SELENIUM_BROWSER = browser;
};

fluid.defaults("fluid.test.webdriver.allBrowsers.testEnvironment", {
    gradeNames: ["fluid.component"],
    listeners: {
        "onCreate.setBrowser": {
            funcName: "fluid.test.webdriver.allBrowsers.setBrowser",
            args:     ["{that}.options.browser"]
        }
    }
});

/*

    A static list of the default (confirmed working) browsers, by platform.  The "firefox" and "edge" browsers are not
    yet confirmed working on Windows.  See the README for details on running the tests with "ie", which works, but not
    in combination with any other browser.

    Only OS X, Windows, and Linux have any browsers at all, as the other platforms are not supported by Selenium itself:

    http://www.seleniumhq.org/about/platforms.jsp

 */
fluid.test.webdriver.allBrowsers.defaultPlatformBrowsers = {
    aix:     [],
    // Firefox is not supported on desktop platforms until https://issues.fluid.net/browse/fluid-1913 is resolved.
    darwin:  ["chrome"],
    freebsd: [],
    linux:   ["firefox", "chrome"],
    openbsd: [],
    sunos:   [],
    // Firefox is not supported on desktop platforms until https://issues.fluid.net/browse/fluid-1913 is resolved.
    win32:   ["chrome"] // See the README (or the comment above) for details regarding "ie".
};

// A grade that gets the list of browsers and then calls its `runTestsInSingleBrowser` invoker.
fluid.defaults("fluid.test.webdriver.allBrowsers", {
    gradeNames: ["fluid.component"],
    listeners: {
        "onCreate.runAllTests": {
            funcName: "fluid.test.webdriver.allBrowsers.runAllTests",
            args:     ["{that}"]
        }
    },
    invokers: {
        runTestsInSingleBrowser: {
            funcName: "fluid.test.webdriver.allBrowsers.generateAndRunTestEnvironment",
            args:     ["{that}", "{arguments}.0"] // browser
        }
    }
});
