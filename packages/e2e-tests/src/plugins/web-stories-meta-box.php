<?php
/**
 * Plugin Name: Web Stories Test Plugin: Meta Box
 * Plugin URI:  https://github.com/google/web-stories-wp
 * Description: Test plugin for custom meta boxes.
 * Author:      Google
 * Author URI:  https://opensource.google.com/
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

namespace Google\Web_Stories\E2E_Tests;

function add_meta_box() {
	\add_meta_box(
		'web-stories-test-meta-box',
		'Web Stories Test Meta Box',
		static function( $post ) {
			// Add an nonce field so we can check for it later.
			wp_nonce_field( 'web_stories_test_meta_box', 'web_stories_test_meta_box_nonce' );

			$value = get_post_meta( $post->ID, '_web_stories_test_meta_box_content', true );
			?>
			<label for="web_stories_test_meta_box_field">Meta Box Test Content:</label>
			<input type="text" id="web_stories_test_meta_box_field" name="web_stories_test_meta_box_content" value="<?php echo esc_attr( $value ); ?>" />
			<?php
		}
	);
}

add_action( 'add_meta_boxes', __NAMESPACE__ . '\add_meta_box' );

function save_post( $post_id ) {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! isset( $_POST['web_stories_test_meta_box_nonce'] ) ) {
		return;
	}

	$nonce = $_POST['web_stories_test_meta_box_nonce'];

	if ( ! wp_verify_nonce( $nonce, 'web_stories_test_meta_box' ) ) {
		return;
	}

	$post_type     = get_post_type( $post_id );
	$post_type_obj = get_post_type_object( $post_type );

	if ( ! current_user_can( $post_type_obj->cap->edit_post, $post_id ) ) {
		return;
	}

	$value = sanitize_text_field( $_POST['web_stories_test_meta_box_content'] );

	update_post_meta( $post_id, '_web_stories_test_meta_box_content', $value );
}

add_action( 'save_post', __NAMESPACE__ . '\save_post' );

function render_head() {
	$value = get_post_meta( get_the_ID(), '_web_stories_test_meta_box_content', true );
	?>
	<meta property="web-stories:meta-box-test" content="<?php echo esc_attr( $value ); ?>" />
	<?php
}

add_action( 'web_stories_story_head', __NAMESPACE__ . '\render_head' );
add_action( 'wp_head', __NAMESPACE__ . '\render_head' );
