<?php
/**
 * The story editor.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// don't load directly.
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

global $post_type, $post_type_object, $post;

$stories_rest_base = ! empty( $post_type_object->rest_base ) ? $post_type_object->rest_base : $post_type_object->name;
$initial_edits     = [ 'story' => null ];

// Preload common data.
// Important: keep in sync with usage & definition in React app.
$preload_paths = [
	'/web-stories/v1/media/?' . build_query(
		[
			'context'               => 'view',
			'per_page'              => 50,
			'page'                  => 1,
			'_web_stories_envelope' => 'true',
			'_fields'               => rawurlencode(
				implode(
					',',
					[
						'id',
						'date_gmt',
						'media_details',
						'mime_type',
						'featured_media',
						'featured_media_src',
						'alt_text',
						'source_url',
						'meta',
						'web_stories_media_source',
						'web_stories_is_muted',
						// _web_stories_envelope will add these fields, we need them too.
						'body',
						'status',
						'headers',
					]
				)
			),
		]
	),
	'/web-stories/v1/media/?' . build_query(
		[
			'context'  => 'view',
			'per_page' => 10,
			'_fields'  => 'source_url',
		]
	),
	'/web-stories/v1/users/?' . build_query(
		[
			'per_page' => 100,
			'who'      => 'authors',
		]
	),
	'/web-stories/v1/users/me/',
	'/web-stories/v1/taxonomies/?' . build_query(
		[
			'context' => 'edit',
			'show_ui' => 'true',
			'type'    => $post_type_object->name,
		]
	),
];

$story_initial_path = "/web-stories/v1/$stories_rest_base/{$post->ID}/?";
$story_query_params = [
	'_embed'  => rawurlencode(
		implode(
			',',
			[ 'wp:featuredmedia', 'wp:lockuser', 'author', 'wp:publisherlogo', 'wp:term' ]
		)
	),
	'context' => 'edit',
	'_fields' => rawurlencode(
		implode(
			',',
			[
				'id',
				'title',
				'status',
				'slug',
				'date',
				'modified',
				'excerpt',
				'link',
				'meta',
				'story_data',
				'preview_link',
				'edit_link',
				'embed_post_link',
				'permalink_template',
				'style_presets',
				'password',
			]
		)
	),
];

/*
 * Ensure the global $post remains the same after API data is preloaded.
 * Because API preloading can call the_content and other filters, plugins
 * can unexpectedly modify $post.
 */
$backup_global_post = $post;

if ( empty( $_GET['web-stories-demo'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$preload_paths[] = $story_initial_path . build_query( $story_query_params );
} else {
	$story_query_params['web_stories_demo'] = 'true';

	$story_path             = $story_initial_path . build_query( $story_query_params );
	$story_data             = \Google\Web_Stories\rest_preload_api_request( [], $story_path );
	$initial_edits['story'] = ( ! empty( $story_data[ $story_path ]['body'] ) ) ? $story_data[ $story_path ]['body'] : [];
}

/**
 * Preload common data by specifying an array of REST API paths that will be preloaded.
 *
 * Filters the array of paths that will be preloaded.
 *
 * @param string[] $preload_paths Array of paths to preload.
 * @param WP_Post  $post          Post being edited.
 */
$preload_paths = apply_filters( 'web_stories_editor_preload_paths', $preload_paths, $post );

$preload_data = array_reduce(
	$preload_paths,
	'\Google\Web_Stories\rest_preload_api_request',
	[]
);

// Restore the global $post as it was before API preloading.
$post = $backup_global_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

// In order to duplicate classic meta box behaviour, we need to run the classic meta box actions.
require_once ABSPATH . 'wp-admin/includes/meta-boxes.php';
register_and_do_post_meta_boxes( $post );

$editor_settings = \Google\Web_Stories\Services::get( 'editor' )->get_editor_settings();

wp_add_inline_script(
	'wp-api-fetch',
	sprintf( 'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );', wp_json_encode( $preload_data ) ),
	'after'
);

$init_script = <<<JS
	wp.domReady( function() {
	  webStories.initializeStoryEditor( 'web-stories-editor', %s, %s );
	} );
JS;

$script = sprintf( $init_script, wp_json_encode( $editor_settings ), wp_json_encode( $initial_edits ) );

wp_add_inline_script( \Google\Web_Stories\Admin\Editor::SCRIPT_HANDLE, $script );

require_once ABSPATH . 'wp-admin/admin-header.php';

// TODO: Use custom version of the_block_editor_meta_boxes() without the block editor specifics?
?>

<div class="web-stories-wp">
	<h1 class="screen-reader-text hide-if-no-js"><?php esc_html_e( 'Web Stories', 'web-stories' ); ?></h1>
	<div id="web-stories-editor" class="web-stories-editor-app-container hide-if-no-js">
		<h1 class="loading-message"><?php esc_html_e( 'Please wait...', 'web-stories' ); ?></h1>
	</div>

	<div id="metaboxes" class="hidden">
		<?php the_block_editor_meta_boxes(); ?>
	</div>

	<?php // JavaScript is disabled. ?>
	<div class="wrap hide-if-js web-stories-wp-no-js">
		<h1 class="wp-heading-inline"><?php esc_html_e( 'Web Stories', 'web-stories' ); ?></h1>
		<div class="notice notice-error notice-alt">
			<p><?php esc_html_e( 'Web Stories for WordPress requires JavaScript. Please enable JavaScript in your browser settings.', 'web-stories' ); ?></p>
		</div>
	</div>
</div>
