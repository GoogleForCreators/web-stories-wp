<?php
/**
 * Class Conditional_Featured_Image
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

declare(strict_types = 1);

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;

/**
 * Class Conditional_Featured_Image.
 */
class Conditional_Featured_Image extends Service_Base {

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private Story_Post_Type $story_post_type;

	/**
	 * Conditional_Featured_Image constructor.
	 *
	 * @since 1.16.0
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;
	}

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.16.0
	 */
	public function register(): void {
		add_filter( 'cybocfi_enabled_for_post_type', [ $this, 'cybocfi_enabled_for_post_type' ], 99, 2 );
	}

	/**
	 * Filter the conditional-featured-image plugin.
	 *
	 * @since 1.16.0
	 *
	 * @param mixed  $enabled   If enabled or not.
	 * @param string $post_type Post type slug.
	 * @return mixed Filter value.
	 */
	public function cybocfi_enabled_for_post_type( $enabled, string $post_type ) {
		if ( $this->story_post_type->get_slug() === $post_type ) {
			return false;
		}

		return $enabled;
	}
}
