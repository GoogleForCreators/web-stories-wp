<?php
/**
 * Class Meta_Boxes.
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Class Meta_Boxes.
 */
class Meta_Boxes extends Service_Base {
	/**
	 * Supported meta box locations.
	 */
	public const LOCATIONS = [ 'normal', 'advanced', 'side' ];

	/**
	 * Meta box priorities.
	 */
	public const PRIORITIES = [ 'high', 'sorted', 'core', 'default', 'low' ];

	/**
	 * Init.
	 *
	 * @since 1.2.0
	 */
	public function register(): void {
		add_action( 'add_meta_boxes_' . Story_Post_Type::POST_TYPE_SLUG, [ $this, 'remove_meta_boxes' ], PHP_INT_MAX );
	}

	/**
	 * Removes all meta boxes with '__back_compat_meta_box' set to 'true'.
	 *
	 * This removes things like the post author meta box, as this feature is
	 * already included in the editor.
	 *
	 * Mimics what do_meta_boxes() does for the block editor.
	 *
	 * @since 1.2.0
	 *
	 * @see do_meta_boxes()
	 */
	public function remove_meta_boxes(): void {
		global $wp_meta_boxes;

		$screen = get_current_screen();

		if ( ! $screen ) {
			return;
		}

		foreach ( self::LOCATIONS as $context ) {
			if ( ! isset( $wp_meta_boxes[ $screen->id ][ $context ] ) ) {
				continue;
			}

			foreach ( self::PRIORITIES as $priority ) {
				if ( ! isset( $wp_meta_boxes[ $screen->id ][ $context ][ $priority ] ) ) {
					continue;
				}

				foreach ( (array) $wp_meta_boxes[ $screen->id ][ $context ][ $priority ] as $meta_box ) {
					if ( false === $meta_box || ! $meta_box['title'] ) {
						continue;
					}

					if (
						// We don't currently support the 'Custom Fields' meta box.
						'postcustom' === $meta_box['id'] ||
						( \is_array( $meta_box['args'] ) && ! empty( $meta_box['args']['__back_compat_meta_box'] ) )
					) {
						remove_meta_box( $meta_box['id'], $screen, $context );
					}
				}
			}
		}
	}

	/**
	 * Returns the admin URL for handling meta boxes.
	 *
	 * @since 1.2.0
	 *
	 * @param int $story_id Story ID.
	 * @return string Meta box URL.
	 */
	public function get_meta_box_url( $story_id ): string {
		$meta_box_url = admin_url( 'post.php' );
		$meta_box_url = add_query_arg(
			[
				'post'                  => $story_id,
				'action'                => 'edit',
				'meta-box-loader'       => true,
				'meta-box-loader-nonce' => wp_create_nonce( 'meta-box-loader' ),
			],
			$meta_box_url
		);

		return $meta_box_url;
	}

	/**
	 * Returns list of custom meta boxes per location.
	 *
	 * Used to disable empty meta boxes in the editor.
	 *
	 * @since 1.2.0
	 *
	 * @see the_block_editor_meta_boxes()
	 *
	 * @return array List of meta boxes per location.
	 */
	public function get_meta_boxes_per_location(): array {
		global $wp_meta_boxes;

		$screen = get_current_screen();

		if ( ! $screen ) {
			return [];
		}

		$_wp_meta_boxes = $wp_meta_boxes ?? [];

		/**
		 * Filters meta box data before making it available to the editor.
		 *
		 * This allows for the modifications of meta boxes that are already
		 * present by this point. Do not use as a means of adding meta box data.
		 *
		 * @since 1.3.0
		 *
		 * @param array $wp_meta_boxes Global meta box state.
		 */
		$_wp_meta_boxes = apply_filters( 'web_stories_editor_meta_boxes', $_wp_meta_boxes );

		$meta_boxes_per_location = [];
		foreach ( self::LOCATIONS as $context ) {
			$meta_boxes_per_location[ $context ] = [];

			if ( ! isset( $_wp_meta_boxes[ $screen->id ][ $context ] ) ) {
				continue;
			}

			foreach ( self::PRIORITIES as $priority ) {
				if ( ! isset( $_wp_meta_boxes[ $screen->id ][ $context ][ $priority ] ) ) {
					continue;
				}

				$meta_boxes = (array) $_wp_meta_boxes[ $screen->id ][ $context ][ $priority ];
				foreach ( $meta_boxes as $meta_box ) {
					if ( false === $meta_box || ! $meta_box['title'] ) {
						continue;
					}

					$meta_boxes_per_location[ $context ][] = [
						'id'    => $meta_box['id'],
						'title' => $meta_box['title'],
					];
				}
			}
		}

		return $meta_boxes_per_location;
	}
}
