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

namespace Google\Web_Stories\Tests\Unit\AMP;

use AMP_DOM_Utils;
use Brain\Monkey;
use Google\Web_Stories\Tests\Unit\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Story_Sanitizer
 */
class Story_Sanitizer extends TestCase {
	public function set_up(): void {
		parent::set_up();

		$this->stubEscapeFunctions();

		Monkey\Functions\stubs(
			[
				'get_bloginfo' => static function( $show ) {
					switch ( $show ) {
						case 'charset':
							return 'UTF-8';
						case 'language':
							return 'en-US';
					}

					return $show;
				},
				'is_rtl'       => false,
				'home_url'     => 'https://www.example.com',
			]
		);
	}

	/**
	 * Helper method for tests.
	 *
	 * @param string $source
	 * @param array $sanitizer_args
	 * @return string Sanitized HTML.
	 */
	protected function sanitize_and_get( $source, $sanitizer_args ): string {
		$dom = AMP_DOM_Utils::get_dom_from_content( $source );
		$dom->documentElement->setAttribute( 'amp', '' );

		$sanitizer = new \Google\Web_Stories\AMP\Story_Sanitizer( $dom, $sanitizer_args );
		$sanitizer->sanitize();

		return $dom->saveHTML( $dom->documentElement );
	}

	public function get_publisher_logo_data(): array {
		return [
			'publisher_logo_exists'  => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			],
			'publisher_logo_missing' => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" poster-portrait-src="https://example.com/image.png" publisher-logo-src="https://example.com/publisher_logo.png"></amp-story></body></html>',
			],
			'publisher_logo_empty'   => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/publisher_logo.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
			],
		];
	}

	/**
	 * @param string   $source   Source.
	 * @param string   $expected Expected.
	 *
	 * @dataProvider get_publisher_logo_data
	 * @covers ::sanitize
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher_logo
	 */
	public function test_sanitize_publisher_logo( $source, $expected ): void {
		$args = [
			'publisher'      => 'Web Stories',
			'publisher_logo' => 'https://example.com/publisher_logo.png',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertEquals( $expected, $actual );
	}

	public function get_poster_image_data(): array {
		return [
			'Poster image already exists' => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => '',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'Poster image is missing'     => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src=""></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => '',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'Poster image is empty'       => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src=""></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src=""></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => '',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'Poster image is overridden'  => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/portrait.png" poster-landscape-src="https://example.com/landscape.png"></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => '',
					'poster_images'  => [
						'poster-portrait-src'  => 'https://example.com/portrait.png',
						'poster-landscape-src' => 'https://example.com/landscape.png',
					],
					'video_cache'    => false,
				],
			],
		];
	}

	/**
	 * @param string $source   Source.
	 * @param string $expected Expected.
	 * @param array  $args     Args.
	 *
	 * @dataProvider get_poster_image_data
	 * @covers ::sanitize
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_poster_images
	 */
	public function test_sanitize_poster_image( $source, $expected, $args ): void {
		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertEquals( $expected, $actual );
	}

	public function get_publisher_data(): array {
		return [
			'publisher_exists'        => [
				'<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" publisher="New publisher" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => 'New publisher',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'no_publisher'            => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher="New publisher"></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => 'New publisher',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'missing_publisher'       => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher=""></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => '',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'empty_publisher'         => [
				'<amp-story standalone="" title="Example Story" publisher="" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher="" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => '',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'double_quotes_publisher' => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher=\'"double quotes"\'></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => '"double quotes"',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'single_quotes_publisher' => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher="\'single quotes\'"></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => "'single quotes'",
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'not_english_publisher'   => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher="PRÓXIMA"></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => 'PRÓXIMA',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
			'html_publisher'          => [
				'<amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png"></amp-story>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story standalone="" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png" publisher="this &gt; that &lt; that &lt;randomhtml /&gt;"></amp-story></body></html>',
				[
					'publisher_logo' => '',
					'publisher'      => 'this > that < that <randomhtml />',
					'poster_images'  => [],
					'video_cache'    => false,
				],
			],
		];
	}

	/**
	 * @param string $source   Source.
	 * @param string $expected Expected.
	 * @param array  $args   Args
	 *
	 * @dataProvider get_publisher_data
	 * @covers ::sanitize
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_publisher
	 */
	public function test_sanitize_publisher( $source, $expected, $args ): void {
		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::transform_html_start_tag
	 */
	public function test_transform_html_start_tag(): void {
		$source = '<html><head></head><body><amp-story></amp-story></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( ' lang="en-US"', $actual );
	}

	public function data_test_transform_a_tags(): array {
		return [
			'Link without rel or target attribute' => [
				'<html><head></head><body><a href="https://www.google.com">Google</a></body></html>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><a href="https://www.google.com" target="_blank" rel="noreferrer">Google</a></body></html>',
			],
			'Link with existing rel="nofollow"'    => [
				'<html><head></head><body><a href="https://www.google.com" rel="nofollow">Google</a></body></html>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><a href="https://www.google.com" rel="nofollow noreferrer" target="_blank">Google</a></body></html>',
			],
			'Link to same origin'                  => [
				'<html><head></head><body><a href="https://www.example.com">My Site</a></body></html>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><a href="https://www.example.com" target="_blank">My Site</a></body></html>',
			],
			'Link to same origin with existing rel="noreferrer"' => [
				'<html><head></head><body><a href="https://www.example.com" rel="noreferrer">My Site</a></body></html>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><a href="https://www.example.com" target="_blank">My Site</a></body></html>',
			],
			'Outlink'                              => [
				'<html><head></head><body><amp-story-page-outlink layout="nodisplay"><a href="https://www.google.com/">Google</a></amp-story-page-outlink></body></html>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story-page-outlink layout="nodisplay"><a href="https://www.google.com/" target="_blank" rel="noreferrer">Google</a></amp-story-page-outlink></body></html>',
			],
			'Outlink to same origin'               => [
				'<html><head></head><body><amp-story-page-outlink layout="nodisplay"><a href="https://www.example.com/">My Site</a></amp-story-page-outlink></body></html>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><amp-story-page-outlink layout="nodisplay"><a href="https://www.example.com/" target="_blank">My Site</a></amp-story-page-outlink></body></html>',
			],
			'Link with empty data attributes'      => [
				'<html><head></head><body><a href="https://www.google.com" data-tooltip-icon="" data-tooltip-text="">Google</a></body></html>',
				'<html amp="" lang="en-US"><head><meta charset="utf-8"></head><body><a href="https://www.google.com" target="_blank" rel="noreferrer">Google</a></body></html>',
			],
		];
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::transform_a_tags
	 * @dataProvider data_test_transform_a_tags
	 */
	public function test_transform_a_tags( $source, $expected ): void {
		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::deduplicate_inline_styles
	 */
	public function test_deduplicate_inline_styles(): void {
		$source = '<html><head></head><body><amp-story><div style="color: blue;"></div><div style="color: blue;"></div><div style="color: blue; background: white;"></div><div style="color: red;"></div></amp-story></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( '<style>._a7988c6{color: blue;}._91f054f{color: blue; background: white;}._f479d19{color: red;}</style>', $actual );
		$this->assertStringNotContainsString( 'style="', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_video_cache
	 */
	public function test_add_video_cache_disabled(): void {
		$source = '<html><head></head><body><amp-story><amp-video width="720" height="960" poster="https://example.com/poster.jpg" layout="responsive"><source type="video/mp4" src="https://example.com/video.mp4" /></amp-video></amp-story></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringNotContainsString( 'cache="google"', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::add_video_cache
	 */
	public function test_add_video_cache_enabled(): void {
		$source = '<html><head></head><body><amp-story><amp-video width="720" height="960" poster="https://example.com/poster.jpg" layout="responsive"><source type="video/mp4" src="https://example.com/video.mp4" /></amp-video></amp-story></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => true,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( 'cache="google"', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::remove_blob_urls
	 */
	public function test_remove_blob_urls(): void {
		$source = '<html><head></head><body><amp-story><amp-video width="720" height="960" poster="blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a" layout="responsive"><source type="video/mp4" src="blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a" /></amp-video><amp-img src="blob:https://example.com/ecee4374-8f8a-4210-8f2d-9c5f8d6a6c5a" width="100" height="100"></amp-img></amp-story></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringNotContainsString( 'blob:', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::sanitize_srcset
	 */
	public function test_sanitize_srcset(): void {
		$source = '<html><head></head><body><amp-story><amp-img src="https://example.com/image.jpg" width="100" height="100" srcset="https://example.com/image.jpg 1000w,https://example.com/image-768x1024.jpg 768w,https://example.com/image-768x1024.jpg 768w,https://example.com/image-225x300.jpg 225w,https://example.com/image-225x300.jpg 225w,https://example.com/image-150x200.jpg 150w"></amp-img></amp-story></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( 'srcset="https://example.com/image.jpg 1000w, https://example.com/image-768x1024.jpg 768w, https://example.com/image-225x300.jpg 225w, https://example.com/image-150x200.jpg 150w"', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::sanitize_srcset
	 */
	public function test_sanitize_srcset_commas(): void {
		$source = '<html><head></head><body><amp-story><amp-img src="https://example.com/image.jpg" width="100" height="100" srcset="https://example.com/image/1000,1000/image.jpg 1000w,https://example.com/image/768,1024/image-768x1024.jpg 768w,https://example.com/image/225,300/image-225x300.jpg 225w,https://example.com/image/150,200/image-150x200.jpg 150w"></amp-img></amp-story></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( 'srcset="https://example.com/image/1000,1000/image.jpg 1000w, https://example.com/image/768,1024/image-768x1024.jpg 768w, https://example.com/image/225,300/image-225x300.jpg 225w, https://example.com/image/150,200/image-150x200.jpg 150w"', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::sanitize_amp_story_page_outlink
	 */
	public function test_sanitize_amp_story_page_outlink(): void {
		$source = '<html><head></head><body><amp-story-page-outlink layout="nodisplay" cta-image=""><a href="https://www.bonappeteach.com/smoked-apple-cider/" target="_blank" rel="noreferrer">Get The Recipe!</a></amp-story-page-outlink></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( '<amp-story-page-outlink layout="nodisplay">', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::sanitize_amp_story_page_outlink
	 */
	public function test_sanitize_amp_story_page_outlink_element_order(): void {
		$source = '<html><head></head><body><amp-story><amp-story-page><amp-story-page-outlink layout="nodisplay" cta-image=""><a href="https://www.bonappeteach.com/smoked-apple-cider/" target="_blank" rel="noreferrer">Get The Recipe!</a></amp-story-page-outlink><amp-story-grid-layer></amp-story-grid-layer></amp-story-page></amp-story></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( '</amp-story-page-outlink></amp-story-page>', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::remove_page_template_placeholder_images
	 */
	public function test_remove_page_template_placeholder_images(): void {
		$source = '<html><head></head><body><amp-img src="https://example.com/wp-content/plugins/web-stories/assets/images/editor/grid-placeholder.png" width="100" height="100"></amp-img></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringNotContainsString( 'amp-img', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::remove_page_template_placeholder_images
	 */
	public function test_remove_page_template_placeholder_images_hash(): void {
		$source = '<html><head></head><body><amp-img src="https://example.com/wp-content/plugins/web-stories/assets/images/adde98ae406d6b5c95d111a934487252.png" width="100" height="100"></amp-img></body></html>';

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringNotContainsString( 'amp-img', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::use_semantic_heading_tags
	 */
	public function test_use_semantic_heading_tags_no_headings(): void {
		$source = <<<'HTML'
<html><head></head><body><amp-story>
	<amp-story-page>
		<amp-story-grid-layer>
			<p class="text-wrapper" style="font-size:.582524em">Title 1</p>
			<p class="text-wrapper" style="font-size:.582524em">Title 1</p>
			<p class="text-wrapper" style="font-size:.436893em">Title 2</p>
			<p class="text-wrapper" style="font-size:.339805em">Title 3</p>
			<p class="text-wrapper" style="font-size:.291262em">Paragraph</p>
		</amp-story-grid-layer>
	</amp-story-page>
	<amp-story-page>
		<amp-story-grid-layer>
			<p class="text-wrapper" style="font-size:.582524em">Title 1B</p>
			<p class="text-wrapper" style="font-size:.339805em">Title 3B</p>
			<p class="text-wrapper" style="font-size:.436893em">Title 2B</p>
			<p class="text-wrapper" style="font-size:.582524em">Title 1B</p>
			<p class="text-wrapper" style="font-size:.291262em">ParagraphB</p>
		</amp-story-grid-layer>
	</amp-story-page>
</amp-story></body></html>
HTML;

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( 'Title 1</h1>', $actual );
		$this->assertStringContainsString( 'Title 1</h2>', $actual );
		$this->assertStringContainsString( 'Title 2</h2>', $actual );
		$this->assertStringContainsString( 'Title 3</h3>', $actual );
		$this->assertStringContainsString( 'Paragraph</p>', $actual );

		$this->assertStringContainsString( 'Title 1B</h1>', $actual );
		$this->assertStringContainsString( 'Title 1B</h2>', $actual );
		$this->assertStringContainsString( 'Title 2B</h2>', $actual );
		$this->assertStringContainsString( 'Title 3B</h3>', $actual );
		$this->assertStringContainsString( 'ParagraphB</p>', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::use_semantic_heading_tags
	 */
	public function test_use_semantic_heading_tags_existing_headings(): void {
		$source = <<<'HTML'
<html><head></head><body><amp-story>
	<amp-story-page>
		<amp-story-grid-layer>
			<p class="text-wrapper" style="font-size:.582524em">Title 1</p>
			<p class="text-wrapper" style="font-size:.582524em">Title 1</p>
			<h2 class="text-wrapper" style="font-size:.436893em">Title 2</h2>
			<p class="text-wrapper" style="font-size:.339805em">Title 3</p>
			<p class="text-wrapper" style="font-size:.291262em">Paragraph</p>
		</amp-story-grid-layer>
	</amp-story-page>
	<amp-story-page>
		<amp-story-grid-layer>
			<p class="text-wrapper" style="font-size:.582524em">Title 1B</p>
			<h3 class="text-wrapper" style="font-size:.339805em">Title 3B</h3>
			<p class="text-wrapper" style="font-size:.436893em">Title 2B</p>
			<p class="text-wrapper" style="font-size:.582524em">Title 1B</p>
			<p class="text-wrapper" style="font-size:.291262em">ParagraphB</p>
		</amp-story-grid-layer>
	</amp-story-page>
</amp-story></body></html>
HTML;

		$args = [
			'publisher_logo' => '',
			'publisher'      => '',
			'poster_images'  => [],
			'video_cache'    => false,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( 'Title 1</p>', $actual );
		$this->assertStringContainsString( 'Title 1</p>', $actual );
		$this->assertStringContainsString( 'Title 2</h2>', $actual );
		$this->assertStringContainsString( 'Title 3</p>', $actual );
		$this->assertStringContainsString( 'Paragraph</p>', $actual );

		$this->assertStringContainsString( 'Title 1B</p>', $actual );
		$this->assertStringContainsString( 'Title 1B</p>', $actual );
		$this->assertStringContainsString( 'Title 2B</p>', $actual );
		$this->assertStringContainsString( 'Title 3B</h3>', $actual );
		$this->assertStringContainsString( 'ParagraphB</p>', $actual );
	}

	/**
	 * @covers \Google\Web_Stories\AMP\Traits\Sanitization_Utils::use_semantic_heading_tags
	 */
	public function test_use_semantic_heading_tags_short_content(): void {
		$source = <<<'HTML'
<html><head></head><body><amp-story>
	<amp-story-page>
		<amp-story-grid-layer>
			<p class="text-wrapper" style="font-size:.582524em">T 1</p>
			<p class="text-wrapper" style="font-size:.582524em">T 1</p>
			<p class="text-wrapper" style="font-size:.436893em">T 2</p>
			<p class="text-wrapper" style="font-size:.339805em">T 3</p>
			<p class="text-wrapper" style="font-size:.291262em">P</p>
		</amp-story-grid-layer>
	</amp-story-page>
	<amp-story-page>
		<amp-story-grid-layer>
			<p class="text-wrapper" style="font-size:.582524em">T1B</p>
			<p class="text-wrapper" style="font-size:.339805em">T3B</p>
			<p class="text-wrapper" style="font-size:.436893em">T2B</p>
			<p class="text-wrapper" style="font-size:.582524em">T1B</p>
			<p class="text-wrapper" style="font-size:.291262em">PB</p>
		</amp-story-grid-layer>
	</amp-story-page>
</amp-story></body></html>
HTML;

		$args = [
			'publisher_logo'    => '',
			'publisher'         => '',
			'poster_images'     => [],
			'video_cache'       => false,
			'semantic_headings' => true,
		];

		$actual = $this->sanitize_and_get( $source, $args );

		$this->assertStringContainsString( 'T 1</p>', $actual );
		$this->assertStringContainsString( 'T 1</p>', $actual );
		$this->assertStringContainsString( 'T 2</p>', $actual );
		$this->assertStringContainsString( 'T 3</p>', $actual );
		$this->assertStringContainsString( 'P</p>', $actual );

		$this->assertStringContainsString( 'T1B</p>', $actual );
		$this->assertStringContainsString( 'T1B</p>', $actual );
		$this->assertStringContainsString( 'T2B</p>', $actual );
		$this->assertStringContainsString( 'T3B</p>', $actual );
		$this->assertStringContainsString( 'PB</p>', $actual );
	}
}
