<?php
/**
 * Class Update_Publisher_Logos
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

use Google\Web_Stories\Settings;

/**
 * Class Update_Publisher_Logos
 */
class Update_Publisher_Logos extends Migrate_Base {
	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private $settings;

	/**
	 * Analytics constructor.
	 *
	 * @since 1.12.0
	 *
	 * @param Settings $settings Settings instance.
	 * @return void
	 */
	public function __construct( Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Split publisher logos into two options.
	 *
	 * @since 1.7.0
	 */
	public function migrate(): void {
		$publisher_logo_id       = 0;
		$publisher_logo_settings = (array) $this->settings->get_setting( $this->settings::SETTING_NAME_PUBLISHER_LOGOS, [] );

		if ( ! empty( $publisher_logo_settings['active'] ) ) {
			$publisher_logo_id = $publisher_logo_settings['active'];
		}

		$this->settings->update_setting( $this->settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, $publisher_logo_id );
		$this->settings->update_setting( $this->settings::SETTING_NAME_PUBLISHER_LOGOS, array_filter( [ $publisher_logo_id ] ) );
	}
}
