// Helper functions for use in tests, for example, when inspecting the return values from `findElement`.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.webdriver.test");
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
gpii.webdriver.test.inspectElement = function (message, element, elementFn, expectedValue, jqUnitFn) {
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
gpii.webdriver.test.testElementValue = function (message, element, expectedValue, jqUnitFn) {
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
gpii.webdriver.test.testElementSelected = function (message, element, selected) {
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
gpii.webdriver.test.inspectElements = function (message, elements, elementFn, expectedValues) {
    var promises = [];
    fluid.each(elements, function (element) {
        promises.push(element[elementFn]());
    });

    fluid.promise.sequence(promises).then(function (results) {
        jqUnit.assertDeepEq(message, expectedValues, results);
    });
};
