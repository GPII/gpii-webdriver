// Sample jqUnit tests
/* globals jqUnit */
(function () {
    "use strict";

    // Start testing without a module.
    jqUnit.test("test 1 (should pass)", function () {
        jqUnit.assert("Everything is fine");
    });

    jqUnit.test("test 2 (should fail)", function () {
        jqUnit.fail("Everything is not fine.");
    });

    jqUnit.test("test 3 (shallow comparison, should pass)", function () {
        jqUnit.assertEquals("Things are equal.", 1, 1);
    });

    jqUnit.test("test 4 (shallow comparison, should fail)", function () {
        jqUnit.assertEquals("Things are not equal.", 0, 1);
    });

    jqUnit.test("test 5 (deep comparison, should pass)", function () {
        jqUnit.assertDeepEq("Things are deeply equal.", { foo: 1 }, { foo: 1 });
    });

    jqUnit.test("test 6 (deep comparison, should fail)", function () {
        jqUnit.assertEquals("Things are deeply unequal.", { foo: 0}, {foo: 1});
    });

    // Now test with a module
    jqUnit.module("module 1");
    jqUnit.test("module test 1 (should pass)", function () {
        jqUnit.assert("Everything is fine");
    });

    jqUnit.test("module test 2 (should fail)", function () {
        jqUnit.fail("Everything is not fine.");
    });

    jqUnit.test("module test 3 (shallow comparison, should pass)", function () {
        jqUnit.assertEquals("Things are equal.", 1, 1);
    });

    jqUnit.test("module test 4 (shallow comparison, should fail)", function () {
        jqUnit.assertEquals("Things are not equal.", 0, 1);
    });

    jqUnit.test("module test 5 (deep comparison, should pass)", function () {
        jqUnit.assertDeepEq("Things are deeply equal.", { foo: 1 }, { foo: 1 });
    });

    jqUnit.test("module test 6 (deep comparison, should fail)", function () {
        jqUnit.assertEquals("Things are deeply unequal.", { foo: 0}, {foo: 1});
    });
})();
