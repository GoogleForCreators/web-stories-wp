<?php

declare(strict_types = 1);

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

namespace Google\Web_Stories\Tests\Integration;

use Google\Web_Stories\KSES;
use Google\Web_Stories\Page_Template_Post_Type;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;

/**
 * Trait Kses_Setup
 *
 * Helper trait to setup KSES. This is normally setup on init but needed to be manually fired in tests.
 */
trait Kses_Setup {
	public ?KSES $kses = null;
	/**
	 * Setup KSES init class.
	 */
	protected function kses_int(): void {
		$settings        = $this->createMock( Settings::class );
		$story_post_type = new Story_Post_Type( $settings );
		$this->kses      = new KSES(
			$story_post_type,
			new Page_Template_Post_Type( $story_post_type )
		);
		$this->kses->register();
	}

	/**
	 * Remove filters and reset kses by calling kses init.
	 */
	protected function kses_remove_filters(): void {
		kses_init();
	}
}
