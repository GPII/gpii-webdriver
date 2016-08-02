// Helper functions for use in tests, for example, when inspecting the return values from `findElement`.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.test.webdriver");
/**
 *
 * A function to that calls `elementFn` against DOM element `element` and compares the result to `expectedValue` using
 * `jqUnitFn`.
 *
 * @param message {String} A message describing this test.
 * @param element {Object} The DOM element to inspect.
 * @param elementFn {String} The function name we expected to run against the DOM element.
 * @param expectedValue {Object} The expected return value.
 * @param jqUnitFn {String} The jqUnit function to use for the test.
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
 * @param message {String} A message describing this test.
 * @param element {Object} The DOM element to inspect.
 * @param expectedValue {Object} The expected value of the element.
 * @param jqUnitFn {String} The jqUnit function to use for the comparison, typically `assertEquals` or `assertDeepEq`.
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
 * @param message {String} A message describing this test.
 * @param element {Object} The DOM element to inspect.
 * @param selected {Boolean} True if the element should be selected, false otherwise.
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
 * @param message {String} A message describing this test.
 * @param elements {Array} An array of DOM elements.
 * @param elementFn {String} The element function to call for each DOM element.
 * @param expectedValues {Array} An array of expected return values.
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
 * @param map {Map} A map to be converted.
 * @returns {Object} The map in JSON form.
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
 * @param failures {Array} - An array of failure messages returned by an accessibility scanner (see below).
 * @param shouldHaveFailures {Boolean} - Whether the results should contain failures (`false` by default).
 */
gpii.test.webdriver.checkAccessibilityScanResults = function (failures, shouldHaveFailures) {
    if (shouldHaveFailures) {
        jqUnit.assertTrue("There should be at least one accessibility check failure...", failures.length > 0);
    }
    else {
        jqUnit.assertTrue("There should be no accessibility check failures...", failures.length === 0);
        fluid.each(failures, function (failure) {
            jqUnit.assertUndefined("An AxS accessibility check failed...", JSON.stringify(failure, null, 2));
        });
    }
};

fluid.registerNamespace("gpii.test.webdriver.axe");

/**
 *
 * A function to run aXe in a browser and then return the results.  Should be used with `executeAsyncScript`.
 *
 * Requires the accessibility developer toolkit to have already been loaded (for example, by
 * using `executeScript` to pass its source to the browser.
 *
 * @param callback {Function} - The WebDriver API itself supplies a callback that we use to return the results of the scan.
 */
gpii.test.webdriver.axe.runAxe = function (callback) {
    /* globals axe */
    axe.a11yCheck(document, callback);
};

/*

 // TODO: Inject fluid as in initial step in the standard startSequence and create a component on the client side that can handle this pattern, namely:
 // 1. executing a named function/invoker
 // 2. passing the given args to the function
 // We should be calling `fluid.invokeGlobalFunction`

 */

/**
 *
 * Trigger test failure(s) if there are any violations reported by aXe.
 *
 * @param results {Object} - The raw results returned by aXe.
 * @param shouldHaveFailures {Boolean} - Whether there should be failures (set to `false` by default).
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


gpii.test.webdriver.axs.runAxs = function () {
    /* globals axs */
    return axs.Audit.run();
};

/**
 *
 * Trigger test failure(s) if there are any violations reported by the accessibility developer toolkit.
 *
 * @param results {Object} - The raw results returned by the accessibility developer toolkit.
 * @param shouldHaveFailures {Boolean} - Whether there should be failures (set to `false` by default).
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
