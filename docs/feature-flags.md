# Feature flags

The React apps leverage the [`flagged`](https://www.npmjs.com/package/flagged) library to allow guarding code and components behind flags.
This allows hiding unfinished functionality until it is ready to be shown/enabled in the application.

## Adding a feature flag

### PHP changes

In `includes/Experiments.php`, add a new entry like this in the `get_experiments` method:

```php
...
/**
 * Author: @yourGitHubUsername
 * Issue: #12345
 * Creation date: 2020-01-01
 */
[
    'name'        => 'showEasterEgg',
    'label'       => __( 'Easter Egg', 'web-stories' ),
    'description' => __( 'Show jumping bunnies', 'web-stories' ),
    'group'       => 'editor',
],
...
```

Notes:

* `group` can be either `dashboard`, `editor`, or `general`, if the feature is used in both places.

### Usage in JavaScript

You can then use the flag in your code by following the examples in the 
[flagged documentation](https://www.npmjs.com/package/flagged).


## Enabling feature flags by default

At some point, a feature flag will be turned on permanently. To do this, add a `default` field like so:

```php
...
/**
 * Author: @yourGitHubUsername
 * Issue: #12345
 * Creation date: 2020-01-01
 */
[
    'name'        => 'showEasterEgg',
    'label'       => __( 'Easter Egg', 'web-stories' ),
    'description' => __( 'Show jumping bunnies', 'web-stories' ),
    'group'       => 'editor',
    'default'     => true,
],
...
```

Before publishing the next release, all remnants of permanently enabled feature flags shall be removed from the code base.


## Turning on/off feature flags with the Experiments tab

Feature flags can be managed via a hidden "Experiements" tab within the Stories WordPress nav. There you can turn on/off all experiments defined in `includes/Experiments.php`.

To turn it on, add the following to your `wp-config.php` file.

```php
define( 'WEBSTORIES_DEV_MODE', true );
```
