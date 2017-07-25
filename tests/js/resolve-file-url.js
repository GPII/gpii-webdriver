/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var os   = require("os");
var path = require("path");

fluid.require("%gpii-webdriver/src/tests/resolve-file-url");

var jqUnit = require("node-jqunit");

jqUnit.module("Testing static URL resolution function...");


// If we had more than three of these, I would write a quick "runner".  Forgive the very small duplication here.
jqUnit.test("Package-relative paths should be resolved", function () {
    var fileSegments = __filename.split(path.sep);

    var normalizedPath = os.platform() === "win32" ? "/" + fileSegments[0] + "/" + fileSegments.slice(1).join("/") : fileSegments.join("/");
    var expectedUrl = "file://" + normalizedPath;
    jqUnit.assertEquals("A package-relative path should be resolved correctly...", expectedUrl, gpii.test.webdriver.resolveFileUrl("%gpii-webdriver/tests/js/resolve-file-url.js"));
});

jqUnit.test("Static strings should be preserved...", function () {
    jqUnit.assertEquals("A static path should be resolved correctly...", "file:///path/to/file", gpii.test.webdriver.resolveFileUrl("/path/to/file"));
});

jqUnit.test("Missing packages should be ignored...", function () {
    jqUnit.assertEquals("A bogus package name should not be resolved...", "file:///%bogus-package/path/to/file", gpii.test.webdriver.resolveFileUrl("%bogus-package/path/to/file"));
});

jqUnit.test("Windows paths should resolve...", function () {
    jqUnit.assertEquals("Forward slashes should be resolved correctly...", "file:///C:/path/to/file", gpii.test.webdriver.resolveFileUrl("c:/path/to/file"));
    jqUnit.assertEquals("Backslashes should be resolved correctly...", "file:///C:/path/to/file", gpii.test.webdriver.resolveFileUrl("c:\\path\\to\\file"));
});
