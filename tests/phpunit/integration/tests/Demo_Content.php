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

namespace Google\Web_Stories\Tests\Integration;

/**
 * @coversDefaultClass \Google\Web_Stories\Demo_Content
 */
class Demo_Content extends TestCase {
	public function test_json_file_contains_replaceable_urls(): void {
		$file  = WEBSTORIES_PLUGIN_DIR_PATH . 'includes/data/stories/demo.json';
		$story = json_decode( file_get_contents( $file ), true ); // phpcs:ignore

		foreach ( $story['pages'] as $page ) {
			foreach ( $page['elements'] as $element ) {
				if ( ! \array_key_exists( 'resource', $element ) ) {
					continue;
				}

				$this->assertStringStartsWith( 'https://replaceme.com/images/demo-story/', $element['resource']['src'] );
				if ( \array_key_exists( 'poster', $element['resource'] ) ) {
					$this->assertStringStartsWith( 'https://replaceme.com/images/demo-story/', $element['resource']['poster'] );
				}
			}
		}
	}

	/**
	 * @covers ::get_title
	 */
	public function test_get_title(): void {
		$demo  = new \Google\Web_Stories\Demo_Content();
		$title = $demo->get_title();

		$this->assertNotEmpty( $title );
		$this->assertIsString( $title );
	}

	/**
	 * @covers ::get_content
	 */
	public function test_get_content(): void {
		$demo    = new \Google\Web_Stories\Demo_Content();
		$content = $demo->get_content();

		$this->assertNotEmpty( $content );
		$this->assertJson( $content );
	}

	/**
	 * @covers ::update_assets_urls
	 */
	public function test_update_assets_urls(): void {
		$demo    = new \Google\Web_Stories\Demo_Content();
		$content = $demo->get_content();

		$this->assertStringNotContainsString( 'https://replaceme.com', $content, 'Not all URLs have been replaced' );
		$this->assertStringContainsString( WEBSTORIES_CDN_URL . '/images/demo-story/', $content, 'Assets URLs have been corrupted' );
	}

	/**
	 * @covers ::localize_texts
	 */
	public function test_localize_texts(): void {
		$demo    = new \Google\Web_Stories\Demo_Content();
		$content = $demo->get_content();

		$this->assertStringNotContainsString( 'L10N_PLACEHOLDER', $content, 'Not all localization placeholders have been replaced' );
	}
}
