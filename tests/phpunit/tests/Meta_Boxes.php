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
 * @coversDefaultClass \Google\Web_Stories\Meta_Boxes
 */
class Meta_Boxes extends \WP_UnitTestCase {
	/**
	 * @covers ::init
	 */
	public function test_init() {
		$meta_boxes = new \Google\Web_Stories\Meta_Boxes();
		$meta_boxes->init();
		$this->assertSame( PHP_INT_MAX, has_action( 'add_meta_boxes_' . \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG, [ $meta_boxes, 'remove_meta_boxes' ] ) );
	}
}
