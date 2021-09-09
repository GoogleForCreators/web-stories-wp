<?php
/**
 * Class Assets_Localization
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;

/**
 * Class Assets_Localization
 *
 * @package Google\Web_Stories
 */
class Assets_Localization implements Service, Registerable {
	/**
	 * Runs on instantiation.
	 *
	 * @since 1.12.0
	 *
	 * @return void
	 */
	public function register() {
		add_filter( 'pre_load_script_translations', [ $this, 'filter_load_script_translations' ], 10, 4 );
	}

	/**
	 * Filters script translations for Web Stories scripts.
	 *
	 * Ensures that script translations are merged with the ones from dynamically loaded chunks,
	 * which by default would not be covered by the WordPress script localization mechanism.
	 *
	 * @since 1.12.0
	 *
	 * @param string|false|null $translations JSON-encoded translation data.
	 * @param string            $file         Path to the translation file that was loaded.
	 * @param string            $handle       Name of the script to register a translation domain to.
	 * @param string            $domain       The text domain.
	 * @return string|false|null Filtered translation data.
	 */
	public function filter_load_script_translations( $translations, $file, $handle, $domain ) {
		if ( 'web-stories' !== $domain ) {
			return $translations;
		}

		$chunks = wp_scripts()->get_data( $handle, 'web-stories-chunks' );

		if ( ! $chunks ) {
			return $translations;
		}

		remove_filter( 'pre_load_script_translations', [ $this, 'filter_load_script_translations' ] );

		$all_translations      = load_script_translations( $file, $handle, $domain );
		$all_translations_json = $all_translations ? json_decode( $all_translations, true ) : null;
		$all_translations_json = $all_translations_json ?? [
			'locale_data' => [
				'messages' => [
					'' => [],
				],
			],
		];

		foreach ( $chunks as $chunk ) {
			$chunk_translations = load_script_textdomain( $chunk, 'web-stories' );

			if ( ! $chunk_translations ) {
				continue;
			}

			$chunk_translations_json = json_decode( $chunk_translations, true );

			if ( ! $chunk_translations_json ) {
				continue;
			}

			foreach ( $chunk_translations_json['locale_data']['messages'] as $key => $translation ) {
				$all_translations_json['locale_data']['messages'][ $key ] = $translation;
			}
		}

		add_filter( 'pre_load_script_translations', [ $this, 'filter_load_script_translations' ], 10, 4 );

		$all_translations = wp_json_encode( $all_translations_json );

		if ( $all_translations ) {
			return $all_translations;
		}

		return $translations;
	}
}
