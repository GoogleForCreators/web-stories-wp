# Local Environment

## Docker Containers

Since you need a WordPress environment to run the plugin in, the quickest way to get up and running is to use the provided Docker setup.

The following command will automatically verify whether Docker, Composer and Node.js are configured properly and start the local WordPress instance. You may need to run this script multiple times if prompted.

```bash
npm run env:start
```

The WordPress installation should be available at `http://localhost:8899`. To access the dashboard visit `http://localhost:8899/wp-admin` (**Username**: `admin`, **Password**: `password`).

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

## Specifying PHP Version

It is also possible to run the local environment in different PHP versions, like so: 

```bash
PHP_VERSION=8.0 npm run env:start
```

## Custom Environment

Alternatively, you can use your own local WordPress environment (e.g. using [Local by Flywheel](https://localbyflywheel.com/)) and clone this repository right into your `wp-content/plugins` directory.

```bash
cd wp-content/plugins && git clone git@github.com:googleforcreators/web-stories-wp.git web-stories
```
