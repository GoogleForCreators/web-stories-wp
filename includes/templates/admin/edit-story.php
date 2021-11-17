<?php
/**
 * The story editor.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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
$demo              = ( isset( $_GET['web-stories-demo'] ) && (bool) $_GET['web-stories-demo'] ) ? 'true' : 'false'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

// Preload common data.
// Important: keep in sync with usage & definition in React app.
$preload_paths = [
	"/web-stories/v1/$stories_rest_base/{$post->ID}/?" . build_query(
		[
			'_embed'           => rawurlencode(
				implode(
					',',
					[ 'wp:featuredmedia', 'wp:lockuser', 'author', 'wp:publisherlogo', 'wp:term' ]
				)
			),
			'context'          => 'edit',
			'web_stories_demo' => $demo,
			'_fields'          => rawurlencode(
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
		]
	),
	'/web-stories/v1/media/?' . build_query(
		[
			'context'               => 'edit',
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
			'type'    => $post_type_object->name,
		]
	),
];

/**
 * Preload common data by specifying an array of REST API paths that will be preloaded.
 *
 * Filters the array of paths that will be preloaded.
 *
 * @param string[] $preload_paths Array of paths to preload.
 * @param WP_Post  $post          Post being edited.
 */
$preload_paths = apply_filters( 'web_stories_editor_preload_paths', $preload_paths, $post );

/*
 * Ensure the global $post remains the same after API data is preloaded.
 * Because API preloading can call the_content and other filters, plugins
 * can unexpectedly modify $post.
 */
$backup_global_post = $post;

$preload_data = array_reduce(
	$preload_paths,
	'\Google\Web_Stories\rest_preload_api_request',
	[]
);

// Restore the global $post as it was before API preloading.
$post = $backup_global_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

wp_add_inline_script(
	'wp-api-fetch',
	sprintf( 'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );', wp_json_encode( $preload_data ) ),
	'after'
);

// In order to duplicate classic meta box behaviour, we need to run the classic meta box actions.
require_once ABSPATH . 'wp-admin/includes/meta-boxes.php';
register_and_do_post_meta_boxes( $post );

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
