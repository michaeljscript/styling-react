const chromeLauncher = require('lighthouse/chrome-launcher');
const lighthouse = require('lighthouse');
const path = require('path');
const fs = require('fs');

const PROJECT_TEST = process.env.CHROME_PAINT_TEST || 'css';
const startTimeStr = new Date().toLocaleTimeString().replace(/:/g, '-');

// launch chrome audit https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/readme.md#using-programmatically
const launchChromeAndRunLighthouse = (url, flags = {}, config = null) => {
    return chromeLauncher.launch().then(chrome => {
        flags.port = chrome.port;
        return lighthouse(url, flags, config).then(results => chrome.kill().then(() => results));
    });
}

const URL = `file:///${path.join(__dirname, PROJECT_TEST, 'index.html')}`;
const OUTPUT_DIRECTORY = path.join(__dirname, '..', 'results');
const RESULT_FILE = path.join(OUTPUT_DIRECTORY, `audit_${startTimeStr}_result.json`);


// write aggregated results into file audit_results.json
const finishTest = (results) => {
    fs.writeFileSync(RESULT_FILE, JSON.stringify(results));
    console.log('[TEST] FINISHED.');
    console.log(`[TEST] Results can be found here ${RESULT_FILE}`);
}

// launch chrome performance test on a website
const launchTests = (url, times = 10, resultsMs = []) => new Promise((resolve, reject) => {

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

    console.log('[TEST] launching chrome session');

    // start the test
    return launchChromeAndRunLighthouse(url, flags, config).then(results => {
        const { audits } = results;
        const paint = audits['first-meaningful-paint'];
        const time = new Date();

        console.log(`[TEST] finished at ${time.toLocaleTimeString()} with the evaluation time ${paint.displayValue}`);
        return paint;
    }).then(paint => {
        if (times - 1 > 0) {
            return launchTests(url, times - 1, [...resultsMs, paint.displayValue]);
        }

        return finishTest([...resultsMs, paint.displayValue]);
    });
});


launchTests(URL, 100).catch(error => console.log({ error }));