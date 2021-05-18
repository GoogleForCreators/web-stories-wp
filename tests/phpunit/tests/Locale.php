<?php
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

namespace Google\Web_Stories\Tests;

/**
 * @coversDefaultClass \Google\Web_Stories\Locale
 */
class Locale extends Test_Case {
	/**
	 * @covers ::get_locale_settings
	 */
	public function test_get_locale_settings() {
		$actual = ( new \Google\Web_Stories\Locale() )->get_locale_settings();

		$this->assertCount( 11, $actual );
		$this->assertEqualSets(
			[
				'locale',
				'dateFormat',
				'timeFormat',
				'gmtOffset',
				'timezone',
				'months',
				'monthsShort',
				'weekdays',
				'weekdaysShort',
				'weekdaysInitials',
				'weekStartsOn',
			],
			array_keys( $actual )
		);
		$this->assertInternalType( 'int', $actual['weekStartsOn'] );
	}
}
