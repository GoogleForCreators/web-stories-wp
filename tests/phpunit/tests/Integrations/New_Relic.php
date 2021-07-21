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

namespace Google\Web_Stories\Tests\Integrations;

use Google\Web_Stories\Tests\Test_Case;
use Google\Web_Stories\Integrations\New_Relic as New_Relic_Integration;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\New_Relic
 */
class New_Relic extends Test_Case {
	/**
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$new_relic = new New_Relic_Integration();
		$result    = $this->call_private_method( $new_relic, 'is_needed' );

		$this->assertSame( function_exists( 'newrelic_disable_autorum' ), $result );
	}
}
