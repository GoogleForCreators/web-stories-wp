<?php
/**
 * Class Replace_Conic_Style_Presets
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
 * Class Replace_Conic_Style_Presets
 *
 * @phpstan-type Color array{
 *   type?: string
 * }
 * @phpstan-type StylePresets array{
 *   fillColors: Color[],
 *   textStyles: array<int, array{
 *     backgroundColor?: Color
 *   }>,
 *   textColors: mixed,
 * }
 */
class Replace_Conic_Style_Presets extends Migrate_Base {
	/**
	 * Replaces conic color type with linear.
	 *
	 * @since 1.7.0
	 */
	public function migrate(): void {
		/**
		 * @var array|null $style_presets
		 * @phpstan-var StylePresets|null $style_presets
		 */
		$style_presets = get_option( Story_Post_Type::STYLE_PRESETS_OPTION, false );
		// Nothing to do if style presets don't exist.
		if ( ! $style_presets || ! \is_array( $style_presets ) ) {
			return;
		}

		$fill_colors = [];
		$text_styles = [];
		if ( ! empty( $style_presets['fillColors'] ) ) {
			foreach ( $style_presets['fillColors'] as $color ) {
				if ( ! isset( $color['type'] ) || 'conic' !== $color['type'] ) {
					$text_styles[] = $color;
					continue;
				}
				$updated_preset         = $color;
				$updated_preset['type'] = 'linear';
				$fill_colors[]          = $updated_preset;
			}
		}

		if ( ! empty( $style_presets['textStyles'] ) ) {
			foreach ( $style_presets['textStyles'] as $preset ) {
				if ( empty( $preset['backgroundColor'] ) ) {
					$text_styles[] = $preset;
					continue;
				}
				$bg_color = $preset['backgroundColor'];
				if ( ! isset( $bg_color['type'] ) || 'conic' !== $bg_color['type'] ) {
					$text_styles[] = $preset;
					continue;
				}
				$updated_preset                            = $preset;
				$updated_preset['backgroundColor']['type'] = 'linear';
				$text_styles[]                             = $updated_preset;
			}
		}

		$updated_style_presets = [
			'fillColors' => $fill_colors,
			'textColors' => $style_presets['textColors'],
			'textStyles' => $text_styles,
		];
		update_option( Story_Post_Type::STYLE_PRESETS_OPTION, $updated_style_presets );
	}
}
