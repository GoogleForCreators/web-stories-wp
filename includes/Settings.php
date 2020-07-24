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

use Google\Web_Stories\Traits\Publisher;

/**
 * Settings class.
 */
class Settings {

	use Publisher;

	/**
	 * Settings group.
	 *
	 * @var string
	 */
	const SETTING_GROUP = 'web_stories';

	/**
	 * GA Tracking ID setting name.
	 *
	 * @var string
	 */
	const SETTING_NAME_TRACKING_ID = 'web_stories_ga_tracking_id';

	/**
	 * Active publisher logo setting name.
	 *
	 * @var string
	 */
	const SETTING_NAME_ACTIVE_PUBLISHER_LOGO = 'web_stories_active_publisher_logo';

	/**
	 * Publisher logos setting name.
	 *
	 * @var string
	 */
	const SETTING_NAME_PUBLISHER_LOGOS = 'web_stories_publisher_logos';

	/**
	 * Initializes the Settings logic.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'rest_api_init', [ $this, 'register_settings' ] );
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_TRACKING_ID,
			[
				'show_in_rest' => true,
				'type'         => 'string',
				'description'  => __( 'Google Analytics Tracking ID', 'web-stories' ),
				'default'      => '',
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_ACTIVE_PUBLISHER_LOGO,
			[
				'show_in_rest' => true,
				'type'         => 'integer',
				'description'  => __( 'Default Publisher Logo', 'web-stories' ),
				'default'      => 0,
			]
		);

		register_setting(
			self::SETTING_GROUP,
			self::SETTING_NAME_PUBLISHER_LOGOS,
			[
				'type'         => 'array',
				'description'  => __( 'Publisher Logos', 'web-stories' ),
				'default'      => [],
				'show_in_rest' => [
					'schema' => [
						'items' => [
							'type' => 'integer',
						],
					],
				],
			]
		);
	}
}
