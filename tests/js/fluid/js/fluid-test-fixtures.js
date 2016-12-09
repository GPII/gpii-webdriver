/* eslint no-undef: 0 */
/* globals fluid */
(function () {
    "use strict";
    gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.tests.webdriver.fluid");
    gpii.tests.webdriver.fluid.existingGlobalFunction = function () {
        return true;
    };

    gpii.tests.webdriver.fluid.existingGlobalFunctionWithArgs = function () {
        return arguments.length;
    };
})();
