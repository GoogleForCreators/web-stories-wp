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
 * @coversDefaultClass \Google\Web_Stories\Embed_Base
 */
class Embed_Base extends Test_Case {

	/**
	 * @covers ::filter_kses_allowed_html
	 */
	public function test_adds_amp_story_player_to_list_of_allowed_html() {
		$this->assertArrayHasKey( 'amp-story-player', wp_kses_allowed_html() );
	}
}
