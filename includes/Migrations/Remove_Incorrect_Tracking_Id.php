<?php
/**
 * Class Remove_Incorrect_Tracking_Id
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2023 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2023 Google LLC
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

use Google\Web_Stories\Settings;
use Google\Web_Stories\Tracking;

/**
 * Class Remove_Incorrect_Tracking_Id
 */
class Remove_Incorrect_Tracking_Id extends Migrate_Base {
	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private Settings $settings;

	/**
	 * Constructor.
	 *
	 * @since 1.30.0
	 *
	 * @param Settings $settings Settings instance.
	 * @return void
	 */
	public function __construct( Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Remove incorrect tracking ID.
	 *
	 * @since 1.30.0
	 */
	public function migrate(): void {
		$tracking_id = $this->settings->get_setting( $this->settings::SETTING_NAME_TRACKING_ID );

		if ( Tracking::TRACKING_ID === $tracking_id ) {
			$this->settings->update_setting(
				$this->settings::SETTING_NAME_TRACKING_ID,
				''
			);
		}
	}
}
