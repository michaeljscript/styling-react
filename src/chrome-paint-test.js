const chromeLauncher = require('lighthouse/chrome-launcher');
const lighthouse = require('lighthouse');
const path = require('path');
const fs = require('fs');

const argv = require('yargs').argv;

const REPEAT_TIMES = argv['repeat-times'] || 100;
const LIBRARY = argv['library'];
const startTimeStr = new Date().toLocaleString().replace(/:/g, '-');

const log = (...args) => console.log(`[TEST]`, ...args);
let _chrome = null;

if (!LIBRARY) {
    log(`You need to pass argument library to test a specific library.
    Example: npm run test:chrome -- --library=glamorous
    Other libraries you can test: css, glamorous, inline, radium, sass, styled-components`);
    process.exit(0);
}

// will launch chrome at this url
const URL = `file:///${path.join(__dirname, LIBRARY, 'index.html')}`;
const OUTPUT_DIRECTORY = path.join(__dirname, '..', 'results');
const RESULT_FILE = path.join(OUTPUT_DIRECTORY, `audit_${LIBRARY}_${startTimeStr}_result.json`);

// launch chrome audit https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/readme.md#using-programmatically
const launchChromeAndRunLighthouse = (url, flags = {}, config = null) => {

    if (!_chrome) {
        log('launching chrome instance');
        return chromeLauncher.launch().then(chrome => {
            flags.port = chrome.port;
            _chrome = chrome;
            return lighthouse(url, flags, config);
        }).catch(error => {
            log('ERROR', 'could not start chrome instance', error);
            process.exit(1);
        });
    }


    flags.port = _chrome.port;
    return lighthouse(url, flags, config);
}



const finishTest = (results) => {
    log('finished');

    fs.writeFileSync(RESULT_FILE, JSON.stringify(results));
    log(`Results can be found here ${RESULT_FILE}`);

    log(`killing chrome instance`);
    _chrome.kill().then(() => {
        log(`done`);
    });
}

// launch chrome performance test on a website
const launchTests = async (url, times = 10, resultsMs = []) => new Promise(() => {

    // disable defaults slowing down the device
    const flags = {
        disableNetworkThrottling: true,
        disableCpuThrottling: true,
        disableDeviceEmulation: true
    };

    // test only performance - to run the tests faster
    const config = {
        extends: "lighthouse:default",
        settings: {
            onlyCategories: ["performance"]
        }
    };


    // start the test
    return launchChromeAndRunLighthouse(url, flags, config).then(results => {
        const { audits } = results;
        const paint = audits['first-meaningful-paint'];
        const time = new Date();

        log(`[${times}] finished at ${time.toLocaleTimeString()} with the evaluation time ${paint.displayValue}`);
        return paint;
    }).then(paint => {
        if (times - 1 > 0) {
            return launchTests(url, times - 1, [...resultsMs, paint.displayValue]);
        }

        return finishTest([...resultsMs, paint.displayValue]);
    });
});


launchTests(URL, REPEAT_TIMES).catch(error => log('ERROR', error));