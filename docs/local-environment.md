# Local Environment

## Docker Containers

Since you need a WordPress environment to run the plugin in, the quickest way to get up and running is to use the provided Docker setup.

The following command will automatically verify whether Docker, Composer and Node.js are configured properly and start the local WordPress instance. You may need to run this script multiple times if prompted.

```bash
npm run env:start
```

The WordPress installation should be available at `http://localhost:8899` (**Username**: `admin`, **Password**: `password`).

If you want to access the instance from other LAN device, you need to set the `WordPress Address (URL)` and `Site Address (URL)` in WordPress General Settings to your local IP e.g. `http://192.168.1.48:8899`.

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

## Custom Environment

Alternatively, you can use your own local WordPress environment (e.g. using [Local by Flywheel](https://localbyflywheel.com/)) and clone this repository right into your `wp-content/plugins` directory.

```bash
cd wp-content/plugins && git clone git@github.com:google/web-stories-wp.git web-stories
```
