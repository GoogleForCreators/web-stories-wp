<?php
/**
 * Class Database_Upgrader
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

namespace Google\Web_Stories;

/**
 * Class Database_Upgrader
 *
 * @package Google\Web_Stories
 */
class Database_Upgrader {

	/**
	 * The slug of database option.
	 *
	 * @var string
	 */
	const OPTION = 'web_stories_db_version';

	/**
	 * The slug of database option.
	 *
	 * @var string
	 */
	const PREVIOUS_OPTION = 'web_stories_previous_db_version';

	/**
	 * Hooked into admin_init and walks through an array of upgrade methods.
	 *
	 * @return void
	 */
	public function init() {
		$routines = [
			'1.0.0' => 'upgrade_1',
			'2.0.0' => 'v_2_replace_conic_style_presets',
			'2.0.1' => 'v_2_add_term',
			'2.0.2' => 'remove_broken_text_styles',
			'2.0.3' => 'unify_color_presets',
		];

		$version = get_option( self::OPTION, '0.0.0' );

		if ( version_compare( WEBSTORIES_DB_VERSION, $version, '=' ) ) {
			return;
		}

		array_walk( $routines, [ $this, 'run_upgrade_routine' ], $version );
		$this->finish_up( $version );
	}

	/**
	 * Runs the upgrade routine.
	 *
	 * @param string $routine         The method to call.
	 * @param string $version         The new version.
	 * @param string $current_version The current set version.
	 *
	 * @return void
	 */
	protected function run_upgrade_routine( $routine, $version, $current_version ) {
		if ( version_compare( $current_version, $version, '<' ) ) {
			$this->$routine( $current_version );
		}
	}

	/**
	 * First database migration.
	 *
	 * @return void
	 */
	protected function upgrade_1() {
		// Do nothing.
	}

	/**
	 * Replaces conic color type with linear.
	 *
	 * @return void
	 */
	protected function v_2_replace_conic_style_presets() {
		$style_presets = get_option( Story_Post_Type::STYLE_PRESETS_OPTION, false );
		// Nothing to do if style presets don't exist.
		if ( ! $style_presets || ! is_array( $style_presets ) ) {
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

	/**
	 * Add the editor term, to make sure it exists.
	 *
	 * @return void
	 */
	protected function v_2_add_term() {
		wp_insert_term( 'editor', Media::STORY_MEDIA_TAXONOMY );
	}

	/**
	 * Removes broken text styles (with color.r|g|b structure).
	 *
	 * @return void
	 */
	protected function remove_broken_text_styles() {
		$style_presets = get_option( Story_Post_Type::STYLE_PRESETS_OPTION, false );
		// Nothing to do if style presets don't exist.
		if ( ! $style_presets || ! is_array( $style_presets ) ) {
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

	/**
	 * Migration for version 2.0.3.
	 * Color presets: Removes fillColor and textColor and unifies to one color.
	 *
	 * @return void
	 */
	protected function unify_color_presets() {
		$style_presets = get_option( Story_Post_Type::STYLE_PRESETS_OPTION, false );
		// Nothing to do if style presets don't exist.
		if ( ! $style_presets || ! is_array( $style_presets ) ) {
			return;
		}

		// If either of these is not an array, something is incorrect.
		if ( ! is_array( $style_presets['fillColors'] ) || ! is_array( $style_presets['textColors'] ) ) {
			return;
		}

		$colors = array_merge( $style_presets['fillColors'], $style_presets['textColors'] );

		// Use only one array of colors for now.
		$updated_style_presets = [
			'colors' => $colors,
		];
		update_option( Story_Post_Type::STYLE_PRESETS_OPTION, $updated_style_presets );
	}

	/**
	 * Runs the needed cleanup after an update, setting the DB version to latest version, flushing caches etc.
	 *
	 * @param string $previous_version The previous version.
	 *
	 * @return void
	 */
	protected function finish_up( $previous_version ) {
		update_option( self::PREVIOUS_OPTION, $previous_version );
		update_option( self::OPTION, WEBSTORIES_DB_VERSION );
	}
}
