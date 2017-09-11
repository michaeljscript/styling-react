const chromeLauncher = require('lighthouse/chrome-launcher');
const lighthouse = require('lighthouse');
const path = require('path');
const fs = require('fs');

const argv = require('yargs').argv;

// arguments from console
const REPEAT_TIMES = argv['repeat-times'] || 100; // the amount of times the test will be repeated
const LIBRARY = argv['library']; // name of the library

// custom log messages
const log = (...args) => console.log(`[TEST]`, ...args);

// make sure library name is passed
if (!LIBRARY) {
    log(`You need to pass argument library to test a specific library.
    Example: npm run test:chrome -- --library=glamorous
    Other libraries you can test: css, glamorous, inline, radium, sass, styled-components`);
    process.exit(0);
}

// test start time - replaced forbidden characters
const startTimeStr = new Date().toLocaleString().replace(/:/g, '-');


// will launch chrome at this url
const URL = `file:///${path.join(__dirname, LIBRARY, 'index.html')}`;

// results will be written here
const OUTPUT_DIRECTORY = path.join(__dirname, '..', 'results');
const RESULT_FILE = path.join(OUTPUT_DIRECTORY, `audit_${LIBRARY}_${startTimeStr}_result.json`);


// launch chrome performance test on a website
const launchTests = async ({ url, times = 10, outputFile = './results.json' } = {}) => {

    log('launching chrome instance');
    const chrome = await chromeLauncher.launch();
    
    // disable defaults slowing down the device
    const flags = {
        disableNetworkThrottling: true,
        disableCpuThrottling: true,
        disableDeviceEmulation: true,
        port: chrome.port
    };

    // test only performance - to run the tests faster
    const config = {
        extends: "lighthouse:default",
        settings: {
            onlyCategories: ["performance"]
        }
    };

    const results = [];
    for (let i = 0; i < times; i++) {
        // perform a lighthouse test - yes, it is blocking the queue
        const result = await lighthouse(url, flags, config);

        const { audits } = result;
        const paint = audits['first-meaningful-paint'];
        const time = new Date();

        log(`${i + 1} / ${times} | finished at ${time.toLocaleTimeString()} with the evaluation time ${paint.displayValue}`);
        results.push(paint.displayValue);
    }

    log('finished - writing results');

    fs.writeFileSync(outputFile, JSON.stringify(results));
    log(`Results can be found here ${outputFile}`);

    log(`killing chrome instance`);
    await chrome.kill();

    log(`done`);
};


launchTests({
    url: URL,
    times: REPEAT_TIMES,
    outputFile: RESULT_FILE
}).catch(error => log('ERROR', error));