/* A caseholder that provides common startup sequence steps for all tests. */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.defaults("gpii.test.webdriver.caseHolder", {
    funcName: ["gpii.test.express"]
});
