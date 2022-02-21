<?php
/**
 * Class Context
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories;

/**
 * Class Context
 */
class Context {
	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Context constructor.
	 *
	 * @since 1.15.0
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;
	}

	/**
	 * Determine whether the current response is a single web story.
	 *
	 * @since 1.15.0
	 *
	 * @return bool Whether it is singular story post (and thus an AMP endpoint).
	 */
	public function is_web_story(): bool {
		return is_singular( $this->story_post_type->get_slug() ) && ! is_embed() && ! post_password_required();
	}

	/**
	 * Determine whether the current response being served as AMP.
	 *
	 * @since 1.15.0
	 *
	 * @return bool Whether it is singular story post (and thus an AMP endpoint).
	 */
	public function is_amp(): bool {
		if ( $this->is_web_story() ) {
			return true;
		}

		// Check for `amp_is_request()` first since `is_amp_endpoint()` is deprecated.
		if ( function_exists( '\amp_is_request' ) ) {
			return amp_is_request();
		}

		if ( function_exists( '\is_amp_endpoint' ) ) {
			return is_amp_endpoint();
		}

		return false;
	}

	/**
	 * Determines whether we're currently on the story editor screen.
	 *
	 * @since 1.15.0
	 *
	 * @return bool Whether we're currently on the story editor screen.
	 */
	public function is_story_editor(): bool {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		return $screen && $this->story_post_type->get_slug() === $screen->post_type;
	}

	/**
	 * Determines whether we're currently on the media upload screen.
	 *
	 * @since 1.15.0
	 *
	 * @return bool Whether we're currently on the media upload screen
	 */
	public function is_upload_screen(): bool {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		return $screen && 'upload' === $screen->id;
	}

	/**
	 * Whether we're currently on a block editor screen.
	 *
	 * @since 1.15.0
	 */
	public function is_block_editor(): bool {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		return $screen && $screen->is_block_editor();
	}

	/**
	 * Returns the current screen base if available.
	 *
	 * @since 1.15.0
	 *
	 * @return string|null Current screen base if available.
	 */
	public function get_screen_base(): ?string {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		return $screen->base ?? null;
	}

	/**
	 * Returns the current screen post type if available.
	 *
	 * @since 1.15.0
	 *
	 * @return string|null Current screen post type if available.
	 */
	public function get_screen_post_type(): ?string {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		return $screen->post_type ?? null;
	}
}
