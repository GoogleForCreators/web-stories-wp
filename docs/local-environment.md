# Local Environment

Currently, the two most common ways for setting up a local environment for working on the Web Stories plugin are:

1. Using the provided Docker container, which is also used for running the e2e tests.
2. Using [Local](https://localwp.com/) 

The former can be set up using the command line, the latter provides an easy-to-use GUI.

Local also makes it easy to switch PHP & WordPress versions, and supports HTTPS.
HTTPS is required for some features like video optimization to work properly.

## Docker Container

Since you need a WordPress environment to run the plugin in, the quickest way to get up and running is to use the provided Docker setup.

**Windows user?** It is highly recommended to use Windows Subsystem for Linux (WSL) 2 before trying to set up Docker on Windows. Setups without WSL have not been tested and might not work.

The following command will automatically verify whether Docker is configured properly and start the local WordPress instance.

```bash
npm run env:start
```

The WordPress installation should be available at `http://localhost:8899`.
To access the WordPress admin, visit `http://localhost:8899/wp-admin` (**Username**: `admin`, **Password**: `password`).

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

### Specifying PHP Version

It is also possible to run the local environment in different PHP versions, like so: 

```bash
PHP_VERSION=8.0 npm run env:start
```

## Custom Environment

If you use something like [Local](https://localwp.com/), you can simply clone this repository right into your `wp-content/plugins` directory.

```bash
cd /path/to/your/local/site/wp-content/plugins && git clone git@github.com:googleforcreators/web-stories-wp.git web-stories
```

Using symlinks works too, if you prefer having your Git projects in some other folders or if you want to use the Web Stories plugin on multiple environments.
