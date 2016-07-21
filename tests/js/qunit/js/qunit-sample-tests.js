// Sample QUnit tests
/* globals QUnit */
(function () {
    "use strict";

    // Start testing without a module.
    QUnit.test("test 1 (should pass)", function () {
        QUnit.ok(true, "Everything is fine");
    });

    QUnit.test("test 2 (should fail)", function () {
        QUnit.ok(false, "Everything is not fine.");
    });

    QUnit.test("test 3 (shallow comparison, should pass)", function () {
        QUnit.equal(1, 1, "Things are equal.");
    });

    QUnit.test("test 4 (shallow comparison, should fail)", function () {
        QUnit.equal(0, 1, "Things are not equal.");
    });

    QUnit.test("test 5 (deep comparison, should pass)", function () {
        QUnit.deepEqual({ foo: 1 }, { foo: 1 }, "Things are deeply equal.");
    });

    QUnit.test("test 6 (deep comparison, should fail)", function () {
        QUnit.equal({ foo: 0}, {foo: 1}, "Things are deeply unequal.");
    });

    // Now test with a module
    QUnit.module("module 1");
    QUnit.test("module test 1 (should pass)", function () {
        QUnit.ok(true, "Everything is fine");
    });

    QUnit.test("module test 2 (should fail)", function () {
        QUnit.ok(false, "Everything is not fine.");
    });

    QUnit.test("module test 3 (shallow comparison, should pass)", function () {
        QUnit.equal(1, 1, "Things are equal.");
    });

    QUnit.test("module test 4 (shallow comparison, should fail)", function () {
        QUnit.equal(0, 1, "Things are not equal.");
    });

    QUnit.test("module test 5 (deep comparison, should pass)", function () {
        QUnit.deepEqual({ foo: 1 }, { foo: 1 }, "Things are deeply equal.");
    });

    QUnit.test("module test 6 (deep comparison, should fail)", function () {
        QUnit.equal({ foo: 0}, {foo: 1}, "Things are deeply unequal.");
    });
})();
