/* A caseholder that provides common startup sequence steps for all tests. */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.loadTestingSupport();

var gpii  = fluid.registerNamespace("gpii");

require("kettle");

require("gpii-express");
gpii.express.loadTestingSupport();

fluid.defaults("gpii.test.webdriver.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder.base"],
    sequenceStart: gpii.test.express.standardSequenceStart,
    sequenceEnd: [
        { func: "{testEnvironment}.webdriver.quit", args: [] },
        { listener: "fluid.identity", event: "{testEnvironment}.events.onFixturesStopped"}
    ]
});

fluid.defaults("gpii.test.webdriver.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    events: {
        constructFixtures: null,
        onDriverReady: null,
        onDriverStopped: null,
        onFixturesConstructed: {
            events: {
                onDriverReady: "onDriverReady"
            }
        },
        onFixturesStopped: {
            events: {
                onDriverStopped: "onDriverStopped"
            }
        }
    },
    components: {
        webdriver: {
            createOnEvent: "constructFixtures",
            type: "gpii.webdriver",
            options: {
                events: {
                    onDriverReady: "{testEnvironment}.events.onDriverReady",
                },
                listeners: {
                    onQuitComplete: { func: "{testEnvironment}.events.onDriverStopped.fire" }
                }
            }
        }
    }
});