/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var url = require("url");

require("../../src/tests/resolve-file-url");

var jqUnit = require("node-jqunit");

jqUnit.module("Testing static URL resolution function...");

// If we had more than three of these, I would write a quick "runner".  Forgive the very small duplication here.
jqUnit.test("Package-relative paths should be resolved", function () {
    jqUnit.assertEquals("A package-relative path should be resolved correctly...", url.resolve("file://", __filename), gpii.test.webdriver.resolveFileUrl("%gpii-webdriver/tests/js/resolve-file-url.js"));
});

jqUnit.test("Static strings should be preserved...", function () {
    jqUnit.assertEquals("A static path should be resolved correctly...", "file:///path/to/file", gpii.test.webdriver.resolveFileUrl("/path/to/file"));
});

jqUnit.test("Missing packages should be ignored...", function () {
    jqUnit.assertEquals("A static path should be resolved correctly...", "file:///%bogus-package/path/to/file", gpii.test.webdriver.resolveFileUrl("%bogus-package/path/to/file"));
});
