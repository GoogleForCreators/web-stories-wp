<?php
/**
 * PHP-Scoper configuration file.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

use Isolated\Symfony\Component\Finder\Finder;

return [
	'prefix'                     => 'Google\\Web_Stories_Dependencies',

	// See: https://github.com/humbug/php-scoper#finders-and-paths.
	'finders'                    => [
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
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-layout-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-meta-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-rule-spec.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-script-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-style-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/class-amp-tag-and-attribute-sanitizer.php',
					'vendor/ampproject/amp-wp/includes/sanitizers/trait-amp-noscript-fallback.php',
					'vendor/ampproject/amp-wp/includes/templates/class-amp-content-sanitizer.php',
				]
			)
			->append( [ 'vendor/ampproject/amp-wp/composer.json' ] ),

		// AMP Common + Optimizer.
		Finder::create()
			->files()
			->ignoreVCS( true )
			->ignoreDotFiles( true )
			->notName( '/LICENSE|.*\\.md|.*\\.svg|.*\\.xml|.*\\.dist|composer\\.json|composer\\.lock/' )
			->exclude(
				[
					'bin',
					'tests',
				]
			)
			->in(
				[
					'vendor/ampproject/amp-wp/lib',
				]
			),

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

		// Symfony mbstring polyfill.
		Finder::create()
			->files()
			->ignoreVCS( true )
			->ignoreDotFiles( true )
			->name( '*.php' )
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
	'patchers'                   => [
		function ( $file_path, $prefix, $contents ) {
			/*
			 * There is currently no easy way to simply whitelist all global WordPress functions.
			 *
			 * This list here is a manual attempt after scanning through the AMP plugin, which means
			 * it needs to be maintained and kept in sync with any changes to the dependency.
			 *
			 * As long as there's no built-in solution in PHP-Scoper for this, an alternative could be
			 * to generate a list based on php-stubs/wordpress-stubs. devowlio/wp-react-starter/ seems
			 * to be doing just this successfully.
			 *
			 * @see https://github.com/humbug/php-scoper/issues/303
			 * @see https://github.com/php-stubs/wordpress-stubs
			 * @see https://github.com/devowlio/wp-react-starter/
			 */
			$contents = str_replace( "\\$prefix\\_doing_it_wrong", '\\_doing_it_wrong', $contents );
			$contents = str_replace( "\\$prefix\\__", '\\__', $contents );
			$contents = str_replace( "\\$prefix\\esc_html_e", '\\esc_html_e', $contents );
			$contents = str_replace( "\\$prefix\\esc_html", '\\esc_html', $contents );
			$contents = str_replace( "\\$prefix\\esc_attr", '\\esc_attr', $contents );
			$contents = str_replace( "\\$prefix\\esc_url", '\\esc_url', $contents );
			$contents = str_replace( "\\$prefix\\do_action", '\\do_action', $contents );
			$contents = str_replace( "\\$prefix\\site_url", '\\site_url', $contents );
			$contents = str_replace( "\\$prefix\\wp_guess_url", '\\wp_guess_url', $contents );
			$contents = str_replace( "\\$prefix\\untrailingslashit", '\\untrailingslashit', $contents );
			$contents = str_replace( "\\$prefix\\WP_CONTENT_URL", '\\WP_CONTENT_URL', $contents );
			$contents = str_replace( "\\$prefix\\wp_list_pluck", '\\wp_list_pluck', $contents );
			$contents = str_replace( "\\$prefix\\is_customize_preview", '\\is_customize_preview', $contents );
			$contents = str_replace( "\\$prefix\\do_action", '\\do_action', $contents );
			$contents = str_replace( "\\$prefix\\trailingslashit", '\\trailingslashit', $contents );
			$contents = str_replace( "\\$prefix\\get_template_directory_uri", '\\get_template_directory_uri', $contents );
			$contents = str_replace( "\\$prefix\\get_stylesheet_directory_uri", '\\get_stylesheet_directory_uri', $contents );
			$contents = str_replace( "\\$prefix\\includes_url", '\\includes_url', $contents );
			$contents = str_replace( "\\$prefix\\wp_styles", '\\wp_styles', $contents );
			$contents = str_replace( "\\$prefix\\get_stylesheet", '\\get_stylesheet', $contents );
			$contents = str_replace( "\\$prefix\\get_template", '\\get_template', $contents );
			$contents = str_replace( "\\$prefix\\wp_parse_url", '\\wp_parse_url', $contents );
			$contents = str_replace( "\\$prefix\\is_wp_error", '\\is_wp_error', $contents );
			$contents = str_replace( "\\$prefix\\content_url", '\\content_url', $contents );
			$contents = str_replace( "\\$prefix\\get_admin_url", '\\get_admin_url', $contents );
			$contents = str_replace( "\\$prefix\\WP_CONTENT_DIR", '\\WP_CONTENT_DIR', $contents );
			$contents = str_replace( "\\$prefix\\ABSPATH", '\\ABSPATH', $contents );
			$contents = str_replace( "\\$prefix\\WPINC", '\\WPINC', $contents );
			$contents = str_replace( "\\$prefix\\home_url", '\\home_url', $contents );
			$contents = str_replace( "\\$prefix\\__", '\\__', $contents );
			$contents = str_replace( "\\$prefix\\wp_array_slice_assoc", '\\wp_array_slice_assoc', $contents );
			$contents = str_replace( "\\$prefix\\wp_json_encode", '\\wp_json_encode', $contents );
			$contents = str_replace( "\\$prefix\\get_transient", '\\get_transient', $contents );
			$contents = str_replace( "\\$prefix\\wp_cache_get", '\\wp_cache_get', $contents );
			$contents = str_replace( "\\$prefix\\set_transient", '\\set_transient', $contents );
			$contents = str_replace( "\\$prefix\\wp_cache_set", '\\wp_cache_set', $contents );
			$contents = str_replace( "\\$prefix\\wp_using_ext_object_cache", '\\wp_using_ext_object_cache', $contents );
			$contents = str_replace( "\\$prefix\\_doing_it_wrong", '\\_doing_it_wrong', $contents );
			$contents = str_replace( "\\$prefix\\plugin_dir_url", '\\plugin_dir_url', $contents );
			$contents = str_replace( "\\$prefix\\is_admin_bar_showing", '\\is_admin_bar_showing', $contents );
			$contents = str_replace( "\\$prefix\\get_bloginfo", '\\get_bloginfo', $contents );
			$contents = str_replace( "\\$prefix\\add_filter", '\\add_filter', $contents );
			$contents = str_replace( "\\$prefix\\apply_filters", '\\apply_filters', $contents );
			$contents = str_replace( "\\$prefix\\add_query_arg", '\\add_query_arg', $contents );
			$contents = str_replace( "\\$prefix\\remove_query_arg", '\\remove_query_arg', $contents );
			$contents = str_replace( "\\$prefix\\get_post", '\\get_post', $contents );
			$contents = str_replace( "\\$prefix\\wp_scripts", '\\wp_scripts', $contents );
			$contents = str_replace( "\\$prefix\\wp_styles", '\\wp_styles', $contents );
			$contents = str_replace( "\\$prefix\\wp_style_is", '\\wp_style_is', $contents );
			$contents = str_replace( "\\$prefix\\WP_PLUGIN_URL", '\\WP_PLUGIN_URL', $contents );
			$contents = str_replace( "\\$prefix\\WPMU_PLUGIN_URL", '\\WPMU_PLUGIN_URL', $contents );
			$contents = str_replace( "\\$prefix\\wp_list_pluck", '\\wp_list_pluck', $contents );
			$contents = str_replace( "\\$prefix\\wp_array_slice_assoc", '\\wp_array_slice_assoc', $contents );
			$contents = str_replace( "\\$prefix\\wp_json_encode", '\\wp_json_encode', $contents );
			$contents = str_replace( "\\$prefix\\WP_Http", '\\WP_Http', $contents );
			$contents = str_replace( "\\$prefix\\WP_Error", '\\WP_Error', $contents );

			return $contents;
		},
	],

	// See https://github.com/humbug/php-scoper#whitelist.
	'whitelist'                  => [],

	// See https://github.com/humbug/php-scoper#constants--classes--functions-from-the-global-namespace.
	'whitelist-global-constants' => false,

	// See https://github.com/humbug/php-scoper#constants--classes--functions-from-the-global-namespace.
	'whitelist-global-classes'   => false,

	// See https://github.com/humbug/php-scoper#constants--classes--functions-from-the-global-namespace.
	'whitelist-global-functions' => false,
];
