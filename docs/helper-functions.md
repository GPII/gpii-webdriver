# Helper Functions

This package provides a range of helper functions intended to help when writing tests.

## `fluid.test.webdriver.inspectElement(message, element, elementFn, expectedValue, jqUnitFn)`

* `message` `{String}` - A message describing this test.
* `element` `{Object}` - The DOM element to inspect.
* `elementFn` `{String}` - The function name we expected to run against the DOM element.
* `expectedValue` `{Object}` - The expected return value.
* `jqUnitFn` `{String}` - The jqUnit function to use for the test.

A function to that calls `elementFn` against DOM element `element` and compares the result to `expectedValue` using
`jqUnitFn`.

## `fluid.test.webdriver.testElementValue(message, element, expectedValue, jqUnitFn)`

* `message` `{String}` - A message describing this test.
* `element` `{Object}` - The DOM element to inspect.
* `expectedValue` `{Object}` - The expected value of the element.
* `jqUnitFn` `{String}` - The jqUnit function to use for the comparison, typically `assertEquals` or `assertDeepEq`.

Get an element's `value` attribute and compare it to an expected value using a particular jqUnit function.

## `fluid.test.webdriver.testElementSelected(message, element, selected)`

* `message` `{String}` - A message describing this test.
* `element` `{Object}` - The DOM element to inspect.
* `selected` `{Boolean}` - True if the element should be selected, false otherwise.

A function to verify whether an element (an `<option>` element, for example) is selected.

## `fluid.test.webdriver.inspectElements(message, elements, elementFn, expectedValues)`

* `message` `{String}` - A message describing this test.
* `elements` `{Array}` - An array of DOM elements.
* `elementFn` `{String}` - The element function to call for each DOM element.
* `expectedValues` `{Array}` - An array of expected return values.

A function to compare an array of elements with an array of expected values.  Ideal for use with
`{fluid.webdriver}.findElements`, which returns an array of elements.

## `fluid.test.webdriver.mapToObject(map)`

* `map` `{Map}` - A map to be converted.
* Returns: {Object} The map in JSON form.

Functions like `fluid.webdriver.getCapabilities` (see [the webdriver docs](./webdriver.md)) return  `Map` objects that
we would like to be able to inspect as plain old Javascript objects.

## `fluid.test.webdriver.invokeGlobal(functionPath, fnArgs, environment)`

A function that can invoke any named global function on the client side with the given arguments.  Both jQuery and
Fluid must be loaded on the target page before you can use this function.

## `fluid.test.webdriver.saveScreenshot(data)`

* `data` - The base64-encoded binary PNG data returned by `takeScreenshot`.
* Returns: The full path to the saved file.

Save a screenshot to a temporary file and let us know where it is.
