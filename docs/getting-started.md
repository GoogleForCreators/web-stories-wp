# Getting Started

## Requirements

To contribute to this plugin, you need the following tools installed on your computer:

- [PHP](https://www.php.net/) - version 7.2 or higher, preferably installed via [Homebrew](https://brew.sh/)
- [Composer](https://getcomposer.org/) (PHP package manager) - to install PHP dependencies.
- [Node.js](https://nodejs.org/en/) (current LTS) - to install JavaScript dependencies.
- [WordPress](https://wordpress.org/download/) - to run the actual plugin.
- [Docker Desktop](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) - for using the local environment

You should be running a Node version matching the [current active LTS release](https://github.com/nodejs/Release#release-schedule) or newer for this plugin to work correctly. You can check your Node.js version by typing node -v in the Terminal prompt.

If you have an incompatible version of Node in your development environment, you can use [nvm](https://github.com/creationix/nvm) to change node versions on the command line:

```bash
nvm install
```

## Local Environment

Since you need a WordPress environment to run the plugin in, the quickest way to get up and running is to use the provided Docker setup.

The following command will automatically verify whether Docker, Composer and Node.js are configured properly and start the local WordPress instance. You may need to run this script multiple times if prompted.

```bash
npm run env:start
```

The WordPress installation should be available at `http://localhost:8899` (**Username**: `admin`, **Password**: `password`).

To later turn off the local environment, you can run:

```bash
npm run env:stop
```

To bring it back later, run the previous command:

```bash
npm run env:start
```

Also, if you need to reset the local environment's database, you can run:

```bash
npm run env:reset-site
```

### Custom Environment

Alternatively, you can use your own local WordPress environment (e.g. using [Local by Flywheel](https://localbyflywheel.com/)) and clone this repository right into your `wp-content/plugins` directory.

```bash
cd wp-content/plugins && git clone git@github.com:google/web-stories-wp.git web-stories
```

**Note:** If you plan on using Local by Flywheel, it is recommended to use [version 3.x](https://localbyflywheel.com/community/t/no-way-to-install-addons-on-local-beta/14756/4) with the Volumes Manager add-on to map your local repository checkout to the plugins folder within the container.

## Development

First of all, you need to make sure that all PHP and JavaScript dependencies are installed:

```bash
composer install
npm install
```

Whether you use the pre-existing local environment or a custom one, any PHP code changes will be directly visible during development.

However, for JavaScript this involves a build process. To watch for any JavaScript file changes and re-build it when needed, you can run the following command:

```bash
npm run dev
```

This way you will get a development build of the JavaScript, which makes debugging easier.

To get a production build, run:

```bash
npm run build:js
```

### Testing

#### PHP Unit Tests

This project uses the [PHPUnit](https://phpunit.de/) testing framework to write unit and integration tests for the PHP part.

To run the full test suite, you can use the following command:

```bash
npm run test:php
```

You can also just run test for a specific function or class by using something like this:

```bash
npm run test:php -- --filter=Story_Post_Type
```

See `npm run test:php:help` to see all the possible options.

#### JavaScript Unit Tests

[Jest](https://jestjs.io/) is used as the JavaScript unit testing framework.

To run the full test suite, you can use the following command:

```bash
npm run test:js
```

You can also watch for any file changes and only run tests that failed or have been modified:

```bash
npm run test:js:watch
```

See `npm run test:js:help` to get a list of additional options that can be passed to the test runner.

#### End-to-End Tests

This project leverages the local Docker-based environment to facilitate end-to-end (e2e) testing using Puppeteer.

To run the full test suite, you can use the following command:

```bash
npm run test:e2e
```

You can also watch for any file changes and only run tests that failed or have been modified:

```bash
npm run test:e2e:watch
```

Not using the built-in local environment? You can also pass any other URL to run the tests against. Example:

```bash
npm run test:e2e -- --wordpress-base-url=https://my-amp-dev-site.local
```

For debugging purposes, you can also run the E2E tests in non-headless mode:

```bash
npm run test:e2e:interactive
```

Note that this will also slow down all interactions during tests by 80ms. You can control these values individually too:

```bash
PUPPETEER_HEADLESS=false npm run test:e2e # Interactive mode, normal speed.
PUPPETEER_SLOWMO=200 npm run test:e2e # Headless mode, slowed down by 200ms.
```

Sometimes one might want to test additional scenarios that aren't possible in a WordPress installation out of the box. That's why the test setup allows for for adding some utility plugins that can be activated during E2E tests.

These plugins can be added to `tests/e2e/plugins` and then activated via the WordPress admin.

#### Storybook

The latest version of the project's [storybook](https://storybook.js.org/) can be found at [https://google.github.io/web-stories-wp/](https://google.github.io/web-stories-wp/).

To run it locally, use the following command:

```bash
npm run storybook
```

#### Testing Environment

The latest version of the plugin is up and running on [https://stories-new-wordpress-amp.pantheonsite.io/](https://stories-new-wordpress-amp.pantheonsite.io/) and ready for maintainers to test.

## Maintenance

### Creating a plugin build

To create a build of the plugin for installing in WordPress as a ZIP package, run:

```bash
npm run build
```
