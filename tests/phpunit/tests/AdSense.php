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
 * @coversDefaultClass \Google\Web_Stories\AdSense
 */
class AdSense extends Test_Case {

	public function setUp() {
		parent::setUp();

		update_option( \Google\Web_Stories\Settings::SETTING_NAME_AD_NETWORK, 'adsense' );
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_ADSENSE_SLOT_ID, '123' );
		update_option( \Google\Web_Stories\Settings::SETTING_NAME_ADSENSE_PUBLISHER_ID, '456' );
	}

	public function tearDown() {
		parent::tearDown();

		delete_option( \Google\Web_Stories\Settings::SETTING_NAME_AD_NETWORK );
		delete_option( \Google\Web_Stories\Settings::SETTING_NAME_ADSENSE_SLOT_ID );
		delete_option( \Google\Web_Stories\Settings::SETTING_NAME_ADSENSE_PUBLISHER_ID );
	}

	/**
	 * @covers ::register
	 */
	public function test_register() {
		$adsense = new \Google\Web_Stories\AdSense();
		$adsense->register();

		$this->assertSame( 10, has_action( 'web_stories_print_analytics', [ $adsense, 'print_adsense_tag' ] ) );
	}

	/**
	 * @covers ::get_publisher_id
	 */
	public function test_get_publisher_id() {
		$adsense = new \Google\Web_Stories\AdSense();
		$result  = $this->call_private_method( $adsense, 'get_publisher_id' );
		$this->assertSame( '456', $result );
	}

	/**
	 * @covers ::get_slot_id
	 */
	public function test_get_slot_id() {
		$adsense = new \Google\Web_Stories\AdSense();
		$result  = $this->call_private_method( $adsense, 'get_slot_id' );
		$this->assertSame( '123', $result );
	}

	/**
	 * @covers ::is_enabled
	 */
	public function test_is_enabled() {
		$adsense = new \Google\Web_Stories\AdSense();
		$result  = $this->call_private_method( $adsense, 'is_enabled' );
		$this->assertTrue( $result );
	}

	/**
	 * @covers ::print_adsense_tag
	 */
	public function test_print_adsense_tag() {
		$adsense = new \Google\Web_Stories\AdSense();

		$output = get_echo( [ $adsense, 'print_adsense_tag' ] );
		$this->assertContains( '<amp-story-auto-ads>', $output );
	}
}
