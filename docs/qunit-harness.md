# The browser-side QUnit harness.

If you have a mix of in-browser QUnit tests and node tests and want a way to seamlessly present the results, this
package provides a harness that will capture the QUnit results from in-browser tests and then make them available from
within node.

To use this, you must include the file `./src/js/qunit-harness.js` and its dependencies in your client-side markup.  To
correctly trap test output, the component and its dependencies must be loaded before your tests start.

Once you have the source and depencies in scope, a global `gpii.webdriver.QUnitHarness.instance` variable will be
created.  This is an instance of `gpii.webdriver.QUnitHarness` (see below).

# `gpii.webdriver.QUnitHarness`

On startup, this component wires a listener to each of QUnit's events.  The listener does two things when an event is
fired:

1. Preserve the data in `that.results`, an array that represents all the events seen to date.
2. Fires its own internal event with the same name so that your node tests can wait for the right event (typically `done`).

//  TODO:  Work on the IPC bridge required for #2 and flesh out the second point.

## Component Options

| Option                    | Type       | Description |
| ------------------------- | ---------- | ----------- |
| `defaultOutputFormat`     | `{String}` | The test format to use if none is specified in the call to `{that}.outputResults` (see below).  You may define your own format, but you must provide the appropriate definitions for all of the options below.  Defaults to "tap".|
| `preamble`                | `{String}` | The raw text that should be send before the test results. |
| `postscript`              | `{String}` | The raw text that should be send after the test results. |
| `outputRules`             | `{Object}` | The [model transformation rules](http://docs.fluidproject.org/infusion/development/ModelTransformationAPI.html) that will be used to decide what data from `{that}.results` will be available for use in generating the text output. |
| `outputTemplates`         | `{Object}` | The [string template](http://docs.fluidproject.org/infusion/development/tutorial-usingStringTemplates/UsingStringTemplates.html) that will be used to convert the transformed data into the final output.  Keyed by output type, then by event (see below). |
| `extendedOutputTemplates` | `{Object}` | The string template to use when preparing extended output for failed tests.  Keyed by output type, then event (see below). |

QUnit fires a range of events when running tests.  Here are the full range, in the order they would be executed if you
ran a single assertion in a single test.

| Event         | Description                     |
| ------------- | ------------------------------- |
| `begin`       | Fired before the tests are run. |
| `moduleStart` | Fired when a module starts. |
| `testStart`   | Fired when a test starts. |
| `log`         | Fired when an individual assertion is made, whether it fails or not. |
| `testDone`    | Fired when a test ends. |
| `moduleDone`  | Fired when a module ends. |
| `done`        | Fired after the tests are run. |

The component fires its own equivalent of each of these events, so that you can (for example) wait for the `done` event
before generating results output.

## Component Invokers

### `{that}.outputResults(formatString)`
* `formatString` `{String}` - The output format to use.  The base grade provies "tap" (Test Anything Protocol) and "text" output (comparable to jqUnit's existing output). The default is "tap".
* Returns: A `{String}` or `{Object}` representing the test results.

This invoker:

1. Transforms the raw test results stored in `{that}.results` based on the rules specified in `outputRules` (see above).
2. Iterates through the transformed test results and produces output based on the output format and event.
3. Returns the generated output.