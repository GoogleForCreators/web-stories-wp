<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration\Media\Video;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Media\Video\Captions
 */
class Captions extends TestCase {
	/**
	 * @covers ::filter_list_of_allowed_filetypes
	 * @group ms-required
	 */
	public function test_filter_list_of_allowed_filetypes(): void {
		/**
		 * @var string $upload_filetypes
		 */
		$upload_filetypes = get_site_option( 'upload_filetypes', 'jpg jpeg png gif' );
		$site_exts        = explode( ' ', $upload_filetypes );
		$this->assertContains( 'vtt', $site_exts );
	}
}
