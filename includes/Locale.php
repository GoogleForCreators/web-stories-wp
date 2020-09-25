<?php
/**
 * Locale class.
 *
 * Locale-related functionality.
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
 * Locale class.
 */
class Locale {
	/**
	 * Returns locale settings for use on the client side.
	 *
	 * @since 1.1.0
	 *
	 * @return array Locale settings.
	 */
	public function get_locale_settings() {
		global $wp_locale;

		return [
			'locale'           => str_replace( '_', '-', get_user_locale() ),
			'dateFormat'       => get_option( 'date_format' ),
			'timeFormat'       => get_option( 'time_format' ),
			'gmtOffset'        => get_option( 'gmt_offset' ),
			'timezone'         => get_option( 'timezone_string' ),
			'months'           => array_values( $wp_locale->month ),
			'monthsShort'      => array_values( $wp_locale->month_abbrev ),
			'weekdays'         => array_values( $wp_locale->weekday ),
			'weekdaysShort'    => array_values( $wp_locale->weekday_abbrev ),
			'weekdaysInitials' => array_values( $wp_locale->weekday_initial ),
			'weekStartsOn'     => (int) get_option( 'start_of_week', 0 ),
		];
	}
}
