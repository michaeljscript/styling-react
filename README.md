# styling-react
Performance test of some styling packages for react.

## awailable scripts
in the main directory you can run

### `npm run build`
to create a production builds for app testing packages

### `npm run build:packages`
to create a production build only for packages

### `npm run test:chrome:*package_name*`
instead of _\*package_name\*_ you can write any of: css, sass, inline, styled-components, glamorous, radium
to start a first meaningful paint using chrome and lighthouse.
This test will run 100 times and may take a long time.