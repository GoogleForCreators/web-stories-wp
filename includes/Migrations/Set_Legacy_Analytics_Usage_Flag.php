<?php
/**
 * Class Set_Legacy_Analytics_Usage_Flag
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

use Google\Web_Stories\Settings;

/**
 * Class Set_Legacy_Analytics_Usage_Flag
 */
class Set_Legacy_Analytics_Usage_Flag extends Migrate_Base {
	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private Settings $settings;

	/**
	 * Migration constructor.
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
	 * Set legacy analytics usage flag.
	 *
	 * @since 1.12.0
	 */
	public function migrate(): void {
		$this->settings->update_setting(
			$this->settings::SETTING_NAME_USING_LEGACY_ANALYTICS,
			! empty( $this->settings->get_setting( $this->settings::SETTING_NAME_TRACKING_ID ) )
		);
	}
}
