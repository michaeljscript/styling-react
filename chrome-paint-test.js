const chromeLauncher = require('lighthouse/chrome-launcher');
const lighthouse = require('lighthouse');
const path = require('path');
const fs = require('fs');

// https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/readme.md#using-programmatically
// launch chrome audit
const launchChromeAndRunLighthouse = (url, flags = {}, config = null) => {
    return chromeLauncher.launch().then(chrome => {
        flags.port = chrome.port;
        return lighthouse(url, flags, config).then(results => chrome.kill().then(() => results));
    });
}

const URL = `file:///${path.join(__dirname, 'src', 'index.html')}`;
const OUTPUT_DIRECTORY = path.join(__dirname, 'results');


// write aggregated results into file audit_results.json
const finishTest = (results) => fs.writeFileSync(path.join(OUTPUT_DIRECTORY, 'audit_result.json'), JSON.stringify(results));

// launch chrome performance test on a website
const launchTests = (url, times = 10, resultsMs = []) => new Promise((resolve, reject) => {
    const flags = {
        disableNetworkThrottling: true,
        disableCpuThrottling: true,
        disableDeviceEmulation: true
    };

    const config = {
        extends: "lighthouse:default",
        settings: {
            onlyCategories: ["performance"]
        }
    };

    console.log('[TEST] launching chrome session');

    return launchChromeAndRunLighthouse(url, flags, config).then(results => {
        const { audits } = results;
        const paint = audits['first-meaningful-paint'];
        const time = new Date();

        console.log(`[TEST] finished at ${time.toLocaleTimeString()} with the evaluation time ${paint.displayValue}`);

        fs.writeFileSync(path.join(OUTPUT_DIRECTORY, `audit_${time.getTime()}.json`), JSON.stringify(audits['first-meaningful-paint']));
        return paint;

    }).then(paint => times - 1 > 0 ? launchTests(url, times - 1, [...resultsMs, paint.displayValue]) : finishTest([...resultsMs, paint.displayValue]));
});



/*launchChromeAndRunLighthouse('https://example.com', {}).then(results => {
    // Use results!
    console.log('done')
});
*/
launchTests(URL, 1).catch(error => console.log({ error }));