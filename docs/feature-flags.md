# Feature flags

The Story Editor is integrated with the `flagged` library to allow guarding code and components behind flags.
This allows hiding unfinished functionality until it is ready to be shown/enabled in the application.

## Adding a feature flag

In `Story_Post_Type.php`, add a new flag entry in the `get_editor_settings` method, eg:

```php
		$settings = [
            ...
			'flags'  => [
                ...
				/**
				 * Description: Description of the new flag.
				 * Author: @yourGithubHandle
				 * Issue: 12345
				 * Creation date: 2020-05-10
				 */
				'newFlag' => false,
			],
            ...
```

You can then use the flag in your code by following the examples in the 
[flagged documentation](https://www.npmjs.com/package/flagged).
