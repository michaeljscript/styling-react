# styling-react
Performance test of some styling packages for react.

You can read about the perofrmance issues of the styling libraries at http://@todo/

## awailable scripts
in the main directory you can run

### `npm run build`
to create a production builds for app testing packages

### `npm run build:packages`
to create a production build only for packages

### `npm run test:chrome:*package_name*`
instead of _\*package_name\*_ you can write any of: _css, sass, inline, styled-components, glamorous and radium_
to start a first meaningful paint test using chrome and lighthouse.
This test will run 100 times and may take a long time.

##
To test render time of the packages you need to create the build,
`npm run build` and open index.html file from the `src/*package*` directory. Add "?measure\_render\_time" into the url to start the test. A copy button will appear after the test finishes. The test will run 100 times and may take a long time to finish.