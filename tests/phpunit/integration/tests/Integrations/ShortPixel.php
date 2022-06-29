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

namespace Google\Web_Stories\Tests\Integration\Integrations;

use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\ShortPixel
 */
class ShortPixel extends DependencyInjectedTestCase {

	/**
	 * @var \Google\Web_Stories\Integrations\ShortPixel
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Integrations\ShortPixel::class );
	}
	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();
		$this->assertSame( 10, has_filter( 'shortpixel_image_urls', [ $this->instance, 'image_urls' ] ) );
	}

	/**
	 * @covers ::image_urls
	 */
	public function test_image_urls(): void {
		$short_pixel = new \Google\Web_Stories\Integrations\ShortPixel();
		$urls        = [ 'http://localhost:8899/wp-content/uploads/2022/03/web-stories-page-template-768.jpg' ];
		$result      = $short_pixel->image_urls( $urls, 10 );
		$this->assertEqualSets( [], $result );
	}

	/**
	 * @covers ::image_urls
	 */
	public function test_image_urls_non_page_template_image(): void {
		$short_pixel = new \Google\Web_Stories\Integrations\ShortPixel();
		/* given a non "page-template" image the urls should pass thru */
		$urls   = [ 'http://localhost:8899/wp-content/uploads/2022/03/example-750.jpg' ];
		$result = $short_pixel->image_urls( $urls, 10 );
		$this->assertEqualSets( $urls, $result );
	}
}
