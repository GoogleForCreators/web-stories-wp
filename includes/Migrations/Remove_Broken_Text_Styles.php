<?php
/**
 * Class Remove_Broken_Text_Styles
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

namespace Google\Web_Stories\Migrations;

use Google\Web_Stories\Story_Post_Type;

/**
 * Class Remove_Broken_Text_Styles
 *
 * @phpstan-type Color array{
 *   type?: string,
 *   r?: int,
 *   g?: int,
 *   b?: int
 * }
 * @phpstan-type StylePresets array{
 *   fillColors: Color[],
 *   textStyles: array<int, array{
 *     backgroundColor?: Color,
 *     color?: Color
 *   }>,
 *   textColors: mixed,
 * }
 */
class Remove_Broken_Text_Styles extends Migrate_Base {
	/**
	 * Removes broken text styles (with color.r|g|b structure).
	 *
	 * @since 1.7.0
	 */
	public function migrate(): void {
		/**
		 * List of style presets.
		 *
		 * @phpstan-var StylePresets|false
		 */
		$style_presets = get_option( Story_Post_Type::STYLE_PRESETS_OPTION, false );
		// Nothing to do if style presets don't exist.
		if ( ! $style_presets || ! \is_array( $style_presets ) ) {
			return;
		}

		$text_styles = [];
		if ( ! empty( $style_presets['textStyles'] ) ) {
			foreach ( $style_presets['textStyles'] as $preset ) {
				if ( isset( $preset['color']['r'] ) ) {
					continue;
				}
				$text_styles[] = $preset;
			}
		}

		$updated_style_presets = [
			'fillColors' => $style_presets['fillColors'],
			'textColors' => $style_presets['textColors'],
			'textStyles' => $text_styles,
		];
		update_option( Story_Post_Type::STYLE_PRESETS_OPTION, $updated_style_presets );
	}
}
