<?php
/**
 * Class Embed_Shortcode.
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

declare(strict_types = 1);

namespace Google\Web_Stories\Shortcode;

use Google\Web_Stories\Embed_Base;

/**
 * Embed shortcode class.
 */
class Embed_Shortcode extends Embed_Base {
	/**
	 * Shortcode name.
	 */
	public const SHORTCODE_NAME = 'web_stories_embed';

	/**
	 * Initializes the Web Stories embed shortcode.
	 *
	 * @since 1.1.0
	 */
	public function register(): void {
		add_shortcode( self::SHORTCODE_NAME, [ $this, 'render_shortcode' ] );
	}

	/**
	 * Renders the shortcode  for given attributes.
	 *
	 * @since 1.1.0
	 *
	 * @param array<string, string|int>|string $attributes Shortcode attributes.
	 * @param string                           $content    Shortcode content.
	 * @return string Rendered Shortcode
	 */
	public function render_shortcode( $attributes, string $content ): string { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		// Initialize '$attrs' when not an array OR is an empty string.
		if ( empty( $attributes ) || ! \is_array( $attributes ) ) {
			$attributes = [];
		}

		$attributes = shortcode_atts( $this->default_attrs(), $attributes, self::SHORTCODE_NAME );

		$attributes['class'] = 'wp-shortcode-web-stories-embed';

		return $this->render( $attributes );
	}
}
