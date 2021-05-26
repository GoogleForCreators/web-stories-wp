<?php
/**
 * Class Amp_Player_Assets.
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

use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;
use WP_Styles;
use WP_Scripts;

/**
 * Class Amp_Player_Assets
 *
 * @package Google\Web_Stories
 */
class Amp_Player_Assets implements Service, Registerable {
	/**
	 * Amp story player handle.
	 *
	 * @var string
	 */
	const HANDLE = 'standalone-amp-story-player';

	/**
	 * Runs on instantiation.
	 *
	 * @since 1.8.0
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'wp_default_styles', [ $this, 'register_style' ] );
		add_action( 'wp_default_scripts', [ $this, 'register_scripts' ] );
	}

	/**
	 * Registers the amp player style.
	 *
	 * @since 1.8.0
	 *
	 * @param WP_Styles $wp_styles WP_Styles instance.
	 *
	 * @return void
	 */
	public function register_style( WP_Styles $wp_styles ) {
		$wp_styles->add(
			self::HANDLE,
			'https://cdn.ampproject.org/amp-story-player-v0.css',
			[],
			'v0'
		);
	}

	/**
	 * Registers the amp player script.
	 *
	 * @since 1.8.0
	 *
	 * @param WP_Scripts $wp_scripts WP_Scripts instance.
	 *
	 * @return void
	 */
	public function register_scripts( WP_Scripts $wp_scripts ) {
		$wp_scripts->add(
			self::HANDLE,
			'https://cdn.ampproject.org/amp-story-player-v0.js',
			[],
			'v0',
			false
		);
	}
}
