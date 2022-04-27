<?php
/**
 * PHP-Scoper configuration file.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

use Isolated\Symfony\Component\Finder\Finder;

$wp_classes   = json_decode( file_get_contents( 'vendor/sniccowp/php-scoper-wordpress-excludes/generated/exclude-wordpress-classes.json' ), true );
$wp_functions = json_decode( file_get_contents( 'vendor/sniccowp/php-scoper-wordpress-excludes/generated/exclude-wordpress-functions.json' ), true );
$wp_constants = json_decode( file_get_contents( 'vendor/sniccowp/php-scoper-wordpress-excludes/generated/exclude-wordpress-constants.json' ), true );

return [
	'prefix'            => 'Google\\Web_Stories_Dependencies',

	// See: https://github.com/humbug/php-scoper#finders-and-paths.
	'finders'           => [
		// Main AMP PHP Library.
		Finder::create()
			->files()
			->ignoreVCS( true )
			->ignoreDotFiles( true )
			->name( '*.php' )
			->name( 'class-amp-base-sanitizer.php' )
			->notName(
				[
					'amp.php',
					'amp-enabled-classic-editor-toggle.php',
					'amp-frontend-actions.php',
					'amp-helper-functions.php',
					'amp-paired-browsing.php',
					'amp-post-template-functions.php',
					'class-amp-autoloader.php',
					'class-amp-comment-walker.php',
					'class-amp-content.php',
					'class-amp-html-utils.php',
					'class-amp-http.php',
					'class-amp-post-template.php',
					'class-amp-post-type-support.php',
					'class-amp-service-worker.php',
					'class-amp-theme-support.php',
					'class-amp-validated-url-post-type.php',
					'class-amp-validation-callback-wrapper.php',
					'deprecated.php',
					'reader-template-loader.php',
				]
			)
			->exclude(
				[
					'admin',
					'assets',
					'back-compat',
					'bin',
					'cli',
					'docs',
					'embeds',
					'includes/admin',
					'includes/cli',
					'includes/embeds',
					'includes/options',
					'includes/settings',
					'includes/validation',
					'includes/widgets',
					'options',
					'patches',
					'sanitizers',
					'settings',
					'src',
					'templates',
					'tests',
					'vendor',
					'widgets',
					'wp-assets',
					'tests',
				]
			)
			->in(
				[
					'vendor/ampproject/amp-wp/includes',
					'vendor/ampproject/amp-wp/src/RemoteRequest',
				]
			)
			->append(
				[
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-allowed-tags-generated.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-base-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-dev-mode-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-layout-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-meta-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-rule-spec.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-script-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-style-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-tag-and-attribute-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/trait-amp-noscript-fallback.php',
					'vendor/ampproject/amp-wp/includes/templates/class-amp-content-sanitizer.php',
					'vendor/ampproject/amp-wp/src/ValidationExemption.php',
				]
			)
				->append( [ 'vendor/ampproject/amp-wp/composer.json' ] ),

		// AMP PHP Toolbox (Common + Optimizer).
		// Not just including /src folder because we also need the /resources folder.
		Finder::create()
			->files()
			->ignoreVCS( true )
			->ignoreDotFiles( true )
			->in(
				[
					'vendor/ampproject/amp-toolbox/src',
					'vendor/ampproject/amp-toolbox/resources',
				]
			)
			->append( [ 'vendor/ampproject/amp-toolbox/composer.json' ] ),

		// FasterImage (used by AMP_Img_Sanitizer).
		Finder::create()
			->files()
			->ignoreVCS( true )
			->ignoreDotFiles( true )
			->name( '*.php' )
			->exclude(
				[
					'tests',
				]
			)
			->in( 'vendor/fasterimage/fasterimage' )
			->append( [ 'vendor/fasterimage/fasterimage/composer.json' ] ),

		// PHP-CSS-Parser (used by AMP_Style_Sanitizer).
		Finder::create()
			->files()
			->ignoreVCS( true )
			->ignoreDotFiles( true )
			->name( '*.php' )
			->exclude(
				[
					'tests',
				]
			)
			->in( 'vendor/sabberworm/php-css-parser' )
			->append( [ 'vendor/sabberworm/php-css-parser/composer.json' ] ),

		Finder::create()
			->files()
			->ignoreVCS( true )
			->ignoreDotFiles( true )
			->name( '*.php' )
			->exclude(
				[
					'tests',
				]
			)
			->in( 'vendor/enshrined/svg-sanitize/src' )
			->append( [ 'vendor/enshrined/svg-sanitize/composer.json' ] ),

		// Symfony mbstring polyfill.
		Finder::create()
			->files()
			->ignoreVCS( true )
			->ignoreDotFiles( true )
			->name( '/\.*.php8?/' )
			->in( 'vendor/symfony/polyfill-mbstring/Resources' )
			->append(
				[
					'vendor/symfony/polyfill-mbstring/Mbstring.php',
					'vendor/symfony/polyfill-mbstring/composer.json',
				]
			),

		// Main composer.json file so that we can build a classmap.
		Finder::create()
			->append( [ 'composer.json' ] ),
	],

	// See: https://github.com/humbug/php-scoper#patchers.
	'patchers'          => [],

	// See https://github.com/humbug/php-scoper#whitelist.
	'whitelist'         => [],

	'exclude-classes'   => $wp_classes,

	'exclude-functions' => $wp_functions,

	'exclude-constants' => array_merge(
		$wp_constants,
		[
			'AMP__FILE__',
			'AMP__DIR__',
			'AMP__VERSION',
		]
	),
];
