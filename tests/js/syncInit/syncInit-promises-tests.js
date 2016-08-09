/*

    The bulk of the tests in this package use the Fluid IoC test framework.  These tests confirm that the `initSync`
    grade can be used in plain old jqUnit tests, and in much the same chained and promise-y way as demonstrated in
    the WebDriver API's code examples.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.syncInit.promises");
gpii.tests.syncInit.promises.runTests = function (browser) {
    jqUnit.module("(" + browser + ") Test `get` with plain old jqUnit and promises...");

    jqUnit.test("Test a local `get`...", function () {
        var url = gpii.test.webdriver.resolveFileUrl("%gpii-webdriver/tests/js/get/html/index.html");
        jqUnit.stop();

        var driver = gpii.webdriver.syncInit();
        driver.get(url);
        driver.getPageSource().then(function (source) {
            jqUnit.start();
            jqUnit.assertNotUndefined("There should be page content...", source);
        });
        driver.quit();
    });

    // Our version of the stock example from the documentation: https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs
    jqUnit.test("Test a remote `get` (requires network access)...", function () {
        jqUnit.stop();
        var driver = gpii.webdriver.syncInit();
        driver.get("http://www.google.com/ncr");
        driver.findElement(gpii.webdriver.By.name("q")).sendKeys("webdriver");
        driver.findElement(gpii.webdriver.By.name("btnG")).click();
        driver.wait(gpii.webdriver.until.titleIs("webdriver - Google Search"), 1000).then(function () {
            jqUnit.start();
            jqUnit.assert("We should have made it to the end of the example...");
        });
        driver.quit();
    });
};

fluid.defaults("gpii.tests.syncInit.promises.runner", {
    gradeNames: ["gpii.test.webdriver.allBrowsers"],
    invokers: {
        "runTestsInSingleBrowser": {
            funcName: "gpii.tests.syncInit.promises.runTests",
            args:     ["{arguments}.0"]
        }
    }
});

gpii.tests.syncInit.promises.runner();
