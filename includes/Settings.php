<?php
/**
 * Settings class.
 *
 * Responsible for adding the stories Settings to WordPress admin.
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
 * Settings class.
 */
class Settings {

	/**
	 * Settings handle.
	 *
	 * @var string
	 */
	const SETTING_NAME = 'web_stories_ga_tracking_id';

	/**
	 * Initializes the Settings logic.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'rest_api_init', [ $this, 'register_setting' ] );
	}

	/**
	 * Regsiter setting.
	 *
	 * @return void
	 */
	public function register_setting() {
		register_setting(
			'web_stories',
			self::SETTING_NAME,
			[
				'show_in_rest' => true,
				'type'         => 'string',
				'description'  => __( 'Google Analytics Tracking ID', 'web-stories' ),
				'default'      => '',
			]
		);
	}
}
