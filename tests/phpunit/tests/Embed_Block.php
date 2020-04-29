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

use WP_Block_Type_Registry;

class Embed_Block extends \WP_UnitTestCase {
	public function test_registers_block_type() {
		$embed_block = new \Google\Web_Stories\Embed_Block();
		$embed_block->init();

		$this->assertTrue( WP_Block_Type_Registry::get_instance()->is_registered( 'web-stories/embed' ) );
	}
}
