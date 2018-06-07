// Helper functions for use in tests, for example, when inspecting the return values from `findElement`.
/* eslint-env node */
/* globals axs */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");
var path = require("path");
var fs = require("fs");
var os = require("os");

fluid.registerNamespace("gpii.test.webdriver");
/**
 *
 * A function to that calls `elementFn` against DOM element `element` and compares the result to `expectedValue` using
 * `jqUnitFn`.
 *
 * @param {String} message A message describing this test.
 * @param {Object} element The DOM element to inspect.
 * @param {String} elementFn The function name we expected to run against the DOM element.
 * @param {Object} expectedValue The expected return value.
 * @param {String} jqUnitFn The jqUnit function to use for the test.
 */
gpii.test.webdriver.inspectElement = function (message, element, elementFn, expectedValue, jqUnitFn) {
    jqUnitFn = jqUnitFn || "assertEquals";
    element[elementFn]().then(function (result) {
        jqUnit[jqUnitFn](message, expectedValue, result);
    });
};

/**
 *
 * Get an element's `value` attribute and compare it to an expected value using a particular jqUnit function.
 *
 * @param {String} message A message describing this test.
 * @param {Object} element The DOM element to inspect.
 * @param {Object} expectedValue The expected value of the element.
 * @param {String} jqUnitFn The jqUnit function to use for the comparison, typically `assertEquals` or `assertDeepEq`.
 *
 */
gpii.test.webdriver.testElementValue = function (message, element, expectedValue, jqUnitFn) {
    jqUnitFn = jqUnitFn || "assertEquals";
    element.getAttribute("value").then(function (result) {
        jqUnit[jqUnitFn](message, expectedValue, result);
    });
};

/**
 *
 * A function to verify whether an element is selected.
 *
 * @param {String} message A message describing this test.
 * @param {Object} element The DOM element to inspect.
 * @param {Boolean} selected True if the element should be selected, false otherwise.
 *
 */
gpii.test.webdriver.testElementSelected = function (message, element, selected) {
    var jqUnitFn = selected ? "assertTrue" : "assertFalse";
    jqUnit[jqUnitFn](message, element.isSelected());
};

/**
 *
 * A function to compare an array of elements with an array of expected values.  Ideal for use with
 * `{gpii.webdriver}.findElements`, which returns an array of elements.
 *
 * @param {String} message A message describing this test.
 * @param {Array} elements An array of DOM elements.
 * @param {String} elementFn The element function to call for each DOM element.
 * @param {Array} expectedValues An array of expected return values.
 *
 */
gpii.test.webdriver.inspectElements = function (message, elements, elementFn, expectedValues) {
    var promises = [];
    fluid.each(elements, function (element) {
        promises.push(element[elementFn]());
    });

    fluid.promise.sequence(promises).then(function (results) {
        jqUnit.assertDeepEq(message, expectedValues, results);
    });
};


/**
 *
 * Some things, like Capabilities, are Map objects that we would like to be able to inspect as plain old Javascript objects.
 *
 * @param {Map} map A map to be converted.
 * @return {Object} The map in JSON form.
 *
 */
gpii.test.webdriver.mapToObject = function (map) {
    var object = {};
    map.forEach(function (value, key) {
        object[key] = value;
    });

    return object;
};

/**
 *
 * A common function that will trigger a failure if the page fails accessibility checks.
 *
 * @param {Array} failures - An array of failure messages returned by an accessibility scanner (see below).
 * @param {Boolean} shouldHaveFailures - Whether the results should contain failures (`false` by default).
 */
gpii.test.webdriver.checkAccessibilityScanResults = function (failures, shouldHaveFailures) {
    if (shouldHaveFailures) {
        jqUnit.assertTrue("There should be at least one accessibility check failure...", failures.length > 0);
    }
    else {
        jqUnit.assertTrue("There should be no accessibility check failures...", failures.length === 0);
        fluid.each(failures, function (failure) {
            jqUnit.fail("An accessibility check failed:\n" + JSON.stringify(failure, null, 2));
        });
    }
};

/**
 *
 * A function that can invoke any function on the client side with the given arguments.  Both jQuery and Fluid must be
 * loaded on the target page before you can use this function.
 *
 * @param {String} functionPath - The namespaced path to the function.
 * @param {Array} [fnArgs] - (optional) Arguments to pass to the function.
 * @param {Object} [environment] - (optional) The object to scope the functionPath to  (typically the framework root for version control).
 * @return {Any} The results of the function's execution.
 *
 */
gpii.test.webdriver.invokeGlobal = function (functionPath, fnArgs, environment) {
    return fluid.invokeGlobalFunction(functionPath, fnArgs, environment);
};

fluid.registerNamespace("gpii.test.webdriver.axe");

/**
 *
 * A function to run aXe in a browser and then return the results.  Should be used with `executeAsyncScript`.
 *
 * Requires the aXe library to have already been loaded (for example, by using `executeScript` to pass its source to the
 * browser.
 *
 * @param {Function} callback - The WebDriver API itself supplies a callback that we use to return the results of the scan.
 */
gpii.test.webdriver.axe.runAxe = function () {
    /* globals axe */
    var callback = arguments[arguments.length - 1];
    var axeOptions = arguments.length > 1 ? arguments[0] : {};
    if (axeOptions) {
        axe.configure(axeOptions);
    }

    // TODO: We cannot use fluid.invokeGlobal here because we need to use the browser's `document` variable.  Discuss with Antranig.
    axe.run(document, function (err, results) {
        callback(results);
    });
};

/**
 *
 * Trigger test failure(s) if there are any violations reported by aXe.
 *
 * @param {Object} results - The raw results returned by aXe.
 * @param {Boolean} shouldHaveFailures - Whether there should be failures (set to `false` by default).
 *
 */
gpii.test.webdriver.axe.checkResults = function (results, shouldHaveFailures) {
    gpii.test.webdriver.checkAccessibilityScanResults(results.violations, shouldHaveFailures);
};

fluid.registerNamespace("gpii.test.webdriver.axs");

/**
 *
 * A function to run the accessibility developer toolkit in a browser and then return the results.  Should be used
 * with `executeScript`.
 *
 * Requires the accessibility developer toolkit to have already been loaded (for example, by
 * using `executeScript` to pass its source to the browser.
 *
 */


gpii.test.webdriver.axs.runAxs = function (axsOptions) {
    var axsConfig = new axs.AuditConfiguration(axsOptions || {});
    var results = axs.Audit.run(axsConfig);
    return results;
};

/**
 *
 * Trigger test failure(s) if there are any violations reported by the accessibility developer toolkit.
 *
 * @param {Object} results - The raw results returned by the accessibility developer toolkit.
 * @param {Boolean} shouldHaveFailures - Whether there should be failures (set to `false` by default).
 *
 */
gpii.test.webdriver.axs.checkResults = function (results, shouldHaveFailures) {
    // Iterate through the raw results and extract just the errors (the accessibility developer toolkit includes all
    // passing checks and warnings as well).
    var failures = [];
    fluid.each(results, function (result) {
        if (result.result === "FAIL") {
            failures.push(result);
        }
    });

    gpii.test.webdriver.checkAccessibilityScanResults(failures, shouldHaveFailures);
};


/**
 *
 * Save a screenshot to a temporary file and let us know where it is.
 *
 * @param {String} data - The base64-encoded binary PNG data returned by `takeScreenshot`.
 *
 */
gpii.test.webdriver.saveScreenshot = function (data) {
    var filePath = path.resolve(os.tmpdir(), "screenshot-" + Date.now() + ".png");
    fs.writeFileSync(filePath, new Buffer(data, "base64"));
    console.log("Screenshot saved to '" + filePath + "'...");
};

