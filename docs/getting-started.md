# Getting Started

## Requirements

To contribute to this plugin, you need the following tools installed on your computer:

- [PHP](https://www.php.net/) - version 7.2 or higher, preferably installed via [Homebrew](https://brew.sh/).
- [Composer](https://getcomposer.org/) (PHP package manager) - version 2.3 or higher, to install PHP dependencies.
- [Node.js](https://nodejs.org/en/) (current LTS) - to install JavaScript dependencies.
- [WordPress](https://wordpress.org/download/) - to run the actual plugin.
- [Docker Desktop](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) - for using the local environment

You should be running a Node version matching the [current active LTS release](https://github.com/nodejs/Release#release-schedule) or newer for this plugin to work correctly.
You can check your Node.js version by typing `node -v` in the Terminal prompt.

If you have an incompatible version of Node in your development environment, you can use [nvm](https://github.com/creationix/nvm) to change node versions on the command line:

```bash
nvm install
```

**Note:** Using `nvm` is recommended, as it makes it easier to stay up-to-date with any Node.js version requirement changes in the project.

## Development

First, you need to make sure that all PHP and JavaScript dependencies are installed:

Install Composer by following [installation instructions](https://getcomposer.org/download/).

Make sure to add `composer` to your `$PATH` if it is not already there. The local environment won't run unless `composer` is in your `$PATH`.

**WSL users** may also need to install `make`.  On WSL Ubuntu you should be able to use:

```bash
sudo apt-get install make
```
or
```bash
sudo apt-get install build-essential
```

To install all the required composer packages, run:

```bash
composer install
```

---

To install all the required npm packages, run:

```bash
npm install
```

Whether you use the pre-existing local environment or a custom one, any PHP code changes will be directly visible during development.

However, for JavaScript this involves a build process. To watch for any JavaScript file changes and re-build it when needed, you can run the following command:

```bash
npm run dev
```

This way you will get a development build of the JavaScript, which makes debugging easier.

For watching for any JavaScript file changes and automatically refreshing the app in the browser (React Fast Refresh), use:

```bash
npm run serve
```

This makes for a much better developer experience as you don't have to manually refresh your browser tab every time you make changes.

To get a production build, run:

```bash
npm run build:js
```

## Local Environment

You will need a WordPress environment to run the plugin.
Check out the [Local Environment](./local-environment.md) document for details on how to set one up.
