# styling-react
Performance test of some styling packages for react.

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
`npm run build` and open index.html file in the `src/\*package\*` directory. To copy the results you need to click on the `copy` button at the bottom of the website. The test will run 100 times