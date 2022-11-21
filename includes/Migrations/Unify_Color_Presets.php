<?php
/**
 * Class Unify_Color_Presets
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

namespace Google\Web_Stories\Migrations;

use Google\Web_Stories\Story_Post_Type;

/**
 * Class Unify_Color_Presets
 */
class Unify_Color_Presets extends Migrate_Base {

	/**
	 * Migration for version 2.0.3.
	 *
	 * Color presets: Removes fillColor and textColor and unifies to one color.
	 *
	 * @since 1.7.0
	 */
	public function migrate(): void {
		$style_presets = get_option( Story_Post_Type::STYLE_PRESETS_OPTION, false );
		// Nothing to do if style presets don't exist.
		if ( ! $style_presets || ! \is_array( $style_presets ) ) {
			return;
		}

		// If either of these is not an array, something is incorrect.
		if ( ! \is_array( $style_presets['fillColors'] ) || ! \is_array( $style_presets['textColors'] ) ) {
			return;
		}

		$colors = [ ... $style_presets['fillColors'], ...$style_presets['textColors'] ];

		// Use only one array of colors for now.
		$updated_style_presets = [
			'colors' => $colors,
		];
		update_option( Story_Post_Type::STYLE_PRESETS_OPTION, $updated_style_presets );
	}
}
