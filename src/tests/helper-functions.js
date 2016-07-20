// Helper functions for use in tests, for example, when inspecting the return values from `findElement`.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.webdriver.test");
gpii.webdriver.test.inspectElement = function (message, element, elementFn, expectedValue, jqUnitFn) {
    jqUnitFn = jqUnitFn || "assertEquals";
    element[elementFn]().then(function (result) {
        jqUnit[jqUnitFn](message, expectedValue, result);
    });
};

gpii.webdriver.test.testElementValue = function (message, element, expectedValue, jqUnitFn) {
    jqUnitFn = jqUnitFn || "assertEquals";
    element.getAttribute("value").then(function (result) {
        jqUnit[jqUnitFn](message, expectedValue, result);
    });
};

gpii.webdriver.test.testElementSelected = function (message, element, selected) {
    var jqUnitFn = selected ? "assertTrue" : "assertFalse";
    jqUnit[jqUnitFn](message, element.isSelected());
};

gpii.webdriver.test.inspectElements = function (message, elements, elementFn, expectedValues) {
    var promises = [];
    fluid.each(elements, function (element) {
        promises.push(element[elementFn]());
    });

    fluid.promise.sequence(promises).then(function (results) {
        jqUnit.assertDeepEq(message, expectedValues, results);
    });
};
