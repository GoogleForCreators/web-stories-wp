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

global $post;

// In order to duplicate classic meta box behaviour, we need to run the classic meta box actions.
require_once ABSPATH . 'wp-admin/includes/meta-boxes.php';
register_and_do_post_meta_boxes( $post );

$editor          = \Google\Web_Stories\Services::get( 'editor' );
$editor_settings = $editor->get_editor_settings();

$story_initial_path = $editor->rest_get_route_for_post( $post );
$story_query_params = $editor->get_rest_query_args();


$initial_edits = [ 'story' => null ];
if ( ! empty( $_GET['web-stories-demo'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$story_query_params['web_stories_demo'] = 'true';

	$story_path             = $story_initial_path . '?' . build_query( $story_query_params );
	$story_data             = \Google\Web_Stories\rest_preload_api_request( [], $story_path );
	$initial_edits['story'] = ( ! empty( $story_data[ $story_path ]['body'] ) ) ? $story_data[ $story_path ]['body'] : [];
}


$init_script = <<<JS
	wp.domReady( function() {
	  webStories.initializeStoryEditor( 'web-stories-editor', %s, %s );
	} );
JS;

$script = sprintf( $init_script, wp_json_encode( $editor_settings ), wp_json_encode( $initial_edits ) );

wp_add_inline_script( \Google\Web_Stories\Admin\Editor::SCRIPT_HANDLE, $script );

$editor->load_stories_editor();

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
