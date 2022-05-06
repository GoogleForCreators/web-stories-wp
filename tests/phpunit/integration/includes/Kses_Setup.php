<?php
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

use Google\Web_Stories\Infrastructure\Injector\SimpleInjector;
use Google\Web_Stories\Product\Shopping_Vendors;

/**
 * Trait Kses_Setup
 *
 * Helper trait to setup KSES. This is normally setup on init but needed to be manually fired in tests.
 */
trait Kses_Setup {
	/**
	 * @var \Google\Web_Stories\KSES
	 */
	public $kses;

	/**
	 * Setup KSES init class.
	 */
	protected function kses_int(): void {
		$settings        = $this->createMock( \Google\Web_Stories\Settings::class );
		$this->kses = new \Google\Web_Stories\KSES(
			new \Google\Web_Stories\Story_Post_Type( $settings )
		);
		$this->kses->register();
	}

	/**
	 * Remove filters and reset kses by calling kses init.
	 */
	protected function kses_remove_filters(): void {
		if ( ! current_user_can( 'unfiltered_html' ) ) {
			remove_filter( 'safe_style_css', [ $this->kses, 'filter_safe_style_css' ] );
			remove_filter( 'wp_kses_allowed_html', [ $this->kses, 'filter_kses_allowed_html' ], 10 );
			remove_filter( 'content_save_pre', [ $this->kseshis, 'filter_content_save_pre_before_kses' ], 0 );
			remove_filter( 'content_save_pre', [ $this->kses, 'filter_content_save_pre_after_kses' ], 20 );
		}
		kses_init();
	}
}
