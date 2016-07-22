/*

    The bulk of the tests in this package use the Fluid IoC test framework.  These tests confirm that other styles
    can be used, notably:

    1. Plain old jqUnit tests.
    2. Using a gpii.webdriver instance in much the same chained and promise-y way as the webdriver docs.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../");
gpii.webdriver.loadTestingSupport();

var jqUnit = require("node-jqunit");

jqUnit.module("Test `get` with plain old jqUnit and promises...");

jqUnit.test("Test a local `get`...", function () {
    var url = gpii.test.webdriver.resolveFileUrl("%gpii-webdriver/tests/js/get/html/index.html")
    jqUnit.stop();

    var driver = gpii.webdriver();

    // TODO: Discuss how to avoid this `builderPromise` wrapper.
    driver.builderPromise.then(function () {
        driver.get(url);
        driver.getPageSource().then(function (source) {
            jqUnit.start();
            jqUnit.assertNotUndefined("There should be page content...", source);
        });
        driver.quit();
    });
});

// Our version of the stock example from the documentation: https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs
jqUnit.test("Test a remote `get` (requires network access)...", function () {
    jqUnit.stop();
    var driver = gpii.webdriver();

    // TODO: Discuss how to avoid this `builderPromise` wrapper.
    driver.builderPromise.then(function () {
        driver.get("http://www.google.com/ncr");
        driver.findElement(gpii.webdriver.By.name("q")).sendKeys("webdriver");
        driver.findElement(gpii.webdriver.By.name("btnG")).click();
        driver.wait(gpii.webdriver.until.titleIs("webdriver - Google Search"), 1000).then(function () {
            jqUnit.start();
            jqUnit.assert("We should have made it to the end of the example...");
        });
        driver.quit();
    });
});
