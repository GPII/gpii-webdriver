/* eslint no-undef: 0 */
/* globals fluid */
(function () {
    "use strict";
    fluid.registerNamespace("fluid.tests.webdriver.fluid");
    fluid.tests.webdriver.fluid.existingGlobalFunction = function () {
        return true;
    };

    fluid.tests.webdriver.fluid.existingGlobalFunctionWithArgs = function () {
        return arguments.length;
    };
})();
