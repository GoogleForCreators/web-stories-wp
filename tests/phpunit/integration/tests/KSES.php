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
 * @coversDefaultClass \Google\Web_Stories\KSES
 */
class KSES extends DependencyInjectedTestCase {
	/**
	 * @var \Google\Web_Stories\KSES
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\KSES::class );
	}
	/**
	 * Testing the safecss_filter_attr() function.
	 *
	 * @param string $css      A string of CSS rules.
	 * @param string $expected Expected string of CSS rules.
	 *
	 * @dataProvider data_test_safecss_filter_attr
	 * @covers ::safecss_filter_attr
	 */
	public function test_safecss_filter_attr( $css, $expected ): void {
		$this->assertSame( $expected, $this->instance->safecss_filter_attr( $css ) );
	}

	/**
	 * Testing the safecss_filter_attr() function with transform attributes.
	 *
	 * @param string $css      A string of CSS rules.
	 * @param string $expected Expected string of CSS rules.
	 *
	 * @dataProvider data_test_safecss_filter_attr
	 * @dataProvider data_test_safecss_filter_attr_extended
	 * @covers ::safecss_filter_attr
	 */
	public function test_safecss_filter_attr_extended( $css, $expected ): void {
		add_filter( 'safe_style_css', [ $this->instance, 'filter_safe_style_css' ] );
		$actual = $this->instance->safecss_filter_attr( $css );
		remove_filter( 'safe_style_css', [ $this->instance, 'filter_safe_style_css' ] );

		$this->assertSame( $expected, $actual );
	}

	/**
	 * Tests if two arrays are recursively merged, the latter overwriting the first.
	 *
	 * @covers ::array_merge_recursive_distinct
	 */
	public function test_array_merge_recursive_distinct(): void {
		$input_array1 = [
			'one' => [
				'one-one' => [],
			],
		];

		$input_array2 = [
			'one' => [
				'one-one' => 'string',
			],
		];

		$output = $this->call_private_method(
			$this->instance,
			'array_merge_recursive_distinct',
			[
				$input_array1,
				$input_array2,
			]
		);
		$this->assertEquals( $output['one']['one-one'], 'string' );
	}

	/**
	 * Data Provider for test_safecss_filter_attr().
	 *
	 * @return array {
	 *     @type array {
	 *         @string string $css      A string of CSS rules.
	 *         @string string $expected Expected string of CSS rules.
	 *     }
	 * }
	 */
	public function data_test_safecss_filter_attr(): array {
		return [
			// Empty input, empty output.
			[
				'css'      => '',
				'expected' => '',
			],
			// An arbitrary attribute name isn't allowed.
			[
				'css'      => 'foo:bar',
				'expected' => '',
			],
			// A single attribute name, with a single value.
			[
				'css'      => 'margin-top: 2px',
				'expected' => 'margin-top: 2px',
			],
			// Backslash \ isn't supported.
			[
				'css'      => 'margin-top: \2px',
				'expected' => '',
			],
			// Curly bracket } isn't supported.
			[
				'css'      => 'margin-bottom: 2px}',
				'expected' => '',
			],
			// A single attribute name, with a single text value.
			[
				'css'      => 'text-transform: uppercase',
				'expected' => 'text-transform: uppercase',
			],
			// Only lowercase attribute names are supported.
			[
				'css'      => 'Text-transform: capitalize',
				'expected' => '',
			],
			// Uppercase attribute values goes through.
			[
				'css'      => 'text-transform: None',
				'expected' => 'text-transform: None',
			],
			// A single attribute, with multiple values.
			[
				'css'      => 'font: bold 15px arial, sans-serif',
				'expected' => 'font: bold 15px arial, sans-serif',
			],
			// Multiple attributes, with single values.
			[
				'css'      => 'font-weight: bold;font-size: 15px',
				'expected' => 'font-weight: bold;font-size: 15px',
			],
			// Multiple attributes, separated by a space.
			[
				'css'      => 'font-weight: bold; font-size: 15px',
				'expected' => 'font-weight: bold;font-size: 15px',
			],
			// Multiple attributes, with multiple values.
			[
				'css'      => 'margin: 10px 20px;padding: 5px 10px',
				'expected' => 'margin: 10px 20px;padding: 5px 10px',
			],
			// Parenthesis ( is supported for some attributes.
			[
				'css'      => 'background: green url("foo.jpg") no-repeat fixed center',
				'expected' => 'background: green url("foo.jpg") no-repeat fixed center',
			],
			// Additional background attributes introduced in 5.3.
			[
				'css'      => 'background-size: cover;background-size: 200px 100px;background-attachment: local, scroll;background-blend-mode: hard-light',
				'expected' => 'background-size: cover;background-size: 200px 100px;background-attachment: local, scroll;background-blend-mode: hard-light',
			],
			// `border-radius` attribute introduced in 5.3.
			[
				'css'      => 'border-radius: 10% 30% 50% 70%;border-radius: 30px',
				'expected' => 'border-radius: 10% 30% 50% 70%;border-radius: 30px',
			],
			// `flex` and related attributes introduced in 5.3.
			[
				'css'      => 'flex: 0 1 auto;flex-basis: 75%;flex-direction: row-reverse;flex-flow: row-reverse nowrap;flex-grow: 2;flex-shrink: 1',
				'expected' => 'flex: 0 1 auto;flex-basis: 75%;flex-direction: row-reverse;flex-flow: row-reverse nowrap;flex-grow: 2;flex-shrink: 1',
			],
			// `grid` and related attributes introduced in 5.3.
			[
				'css'      => 'grid-template-columns: 1fr 60px;grid-auto-columns: min-content;grid-column-start: span 2;grid-column-end: -1;grid-column-gap: 10%;grid-gap: 10px 20px',
				'expected' => 'grid-template-columns: 1fr 60px;grid-auto-columns: min-content;grid-column-start: span 2;grid-column-end: -1;grid-column-gap: 10%;grid-gap: 10px 20px',
			],
			[
				'css'      => 'grid-template-rows: 40px 4em 40px;grid-auto-rows: min-content;grid-row-start: -1;grid-row-end: 3;grid-row-gap: 1em',
				'expected' => 'grid-template-rows: 40px 4em 40px;grid-auto-rows: min-content;grid-row-start: -1;grid-row-end: 3;grid-row-gap: 1em',
			],
			// `grid` does not yet support functions or `\`.
			[
				'css'      => 'grid-template-columns: repeat(2, 50px 1fr);grid-template: 1em / 20% 20px 1fr',
				'expected' => '',
			],
			// `flex` and `grid` alignments introduced in 5.3.
			[
				'css'      => 'align-content: space-between;align-items: start;align-self: center;justify-items: center;justify-content: space-between;justify-self: end',
				'expected' => 'align-content: space-between;align-items: start;align-self: center;justify-items: center;justify-content: space-between;justify-self: end',
			],
			// `columns` and related attributes introduced in 5.3.
			[
				'css'      => 'columns: 6rem auto;column-count: 4;column-fill: balance;column-gap: 9px;column-rule: thick inset blue;column-span: none;column-width: 120px',
				'expected' => 'columns: 6rem auto;column-count: 4;column-fill: balance;column-gap: 9px;column-rule: thick inset blue;column-span: none;column-width: 120px',
			],
			// Gradients introduced in 5.3.
			[
				'css'      => 'background: linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)',
				'expected' => 'background: linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)',
			],
			[
				'css'      => 'background: linear-gradient(135deg,rgba(6,147,227,1) ) (0%,rgb(155,81,224) 100%)',
				'expected' => '',
			],
			[
				'css'      => 'background-image: linear-gradient(red,yellow);',
				'expected' => 'background-image: linear-gradient(red,yellow)',
			],
			[
				'css'      => 'color: linear-gradient(red,yellow);',
				'expected' => '',
			],
			[
				'css'      => 'background-image: linear-gradient(red,yellow); background: prop( red,yellow); width: 100px;',
				'expected' => 'background-image: linear-gradient(red,yellow);width: 100px',
			],
			[
				'css'      => 'background: unknown-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)',
				'expected' => '',
			],
			[
				'css'      => 'background: repeating-linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)',
				'expected' => 'background: repeating-linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%)',
			],
			[
				'css'      => 'width: 100px; height: 100px; background: linear-gradient(135deg,rgba(0,208,132,1) 0%,rgba(6,147,227,1) 100%);',
				'expected' => 'width: 100px;height: 100px;background: linear-gradient(135deg,rgba(0,208,132,1) 0%,rgba(6,147,227,1) 100%)',
			],
			[
				'css'      => 'background: radial-gradient(#ff0, red, yellow, green, rgba(6,147,227,1), rgb(155,81,224) 90%);',
				'expected' => 'background: radial-gradient(#ff0, red, yellow, green, rgba(6,147,227,1), rgb(155,81,224) 90%)',
			],
			[
				'css'      => 'background: radial-gradient(#ff0, red, yellow, green, rgba(6,147,227,1), rgb(155,81,224) 90%);',
				'expected' => 'background: radial-gradient(#ff0, red, yellow, green, rgba(6,147,227,1), rgb(155,81,224) 90%)',
			],
			[
				'css'      => 'background: conic-gradient(at 0% 30%, red 10%, yellow 30%, #1e90ff 50%)',
				'expected' => 'background: conic-gradient(at 0% 30%, red 10%, yellow 30%, #1e90ff 50%)',
			],
			// Expressions are not allowed.
			[
				'css'      => 'height: expression( body.scrollTop + 50 + "px" )',
				'expected' => '',
			],
			// Other than in core, RGB color values ARE allowed.
			[
				'css'      => 'color: rgb( 100, 100, 100 )',
				'expected' => 'color: rgb( 100, 100, 100 )',
			],
			// Other than in core, RGBA color values ARE allowed.
			[
				'css'      => 'color: rgb( 100, 100, 100, .4 )',
				'expected' => 'color: rgb( 100, 100, 100, .4 )',
			],
		];
	}

	/**
	 * Data Provider for test_safecss_filter_attr_extended().
	 *
	 * @return array {
	 *     @type array {
	 *         @string string $css      A string of CSS rules.
	 *         @string string $expected Expected string of CSS rules.
	 *     }
	 * }
	 */
	public function data_test_safecss_filter_attr_extended(): array {
		return [
			// Keyword values.
			[
				'css'      => 'transform: none;',
				'expected' => 'transform: none',
			],
			// Function values.
			[
				'css'      => 'transform: rotate(90deg);',
				'expected' => 'transform: rotate(90deg)',
			],
			// Multiple function values.
			[
				'css'      => 'transform: perspective(500px) translate(10px, 0, 20px) rotateY(3deg);',
				'expected' => 'transform: perspective(500px) translate(10px, 0, 20px) rotateY(3deg)',
			],
			[
				'css'      => '--initial-opacity: 1;',
				'expected' => '--initial-opacity: 1',
			],
			[
				'css'      => '--initial-transform: rotate(4deg) translate3d(108.30768%, 0px, 0) rotate(-4deg);',
				'expected' => '--initial-transform: rotate(4deg) translate3d(108.30768%, 0px, 0) rotate(-4deg)',
			],
			// Global values.
			[
				'css'      => 'transform: inherit;',
				'expected' => 'transform: inherit',
			],
			// Multiple fonts.
			[
				'css'      => 'font-family: "Roboto", "Helvetica Neue", "Helvetica", sans-serif',
				'expected' => 'font-family: "Roboto", "Helvetica Neue", "Helvetica", sans-serif',
			],
			// RGBA Background color.
			[
				'css'      => 'background-color:rgba(255,255,255,0.6);',
				'expected' => 'background-color:rgba(255,255,255,0.6)',
			],
			// CSS clip paths.
			[
				'css'      => 'clip-path:url(#mask-circle-foo-bar)',
				'expected' => 'clip-path:url(#mask-circle-foo-bar)',
			],
			[
				'css'      => '-webkit-clip-path:url(#mask-circle-foo-bar)',
				'expected' => '-webkit-clip-path:url(#mask-circle-foo-bar)',
			],
			// Pointer events.
			[
				'css'      => 'pointer-events: initial',
				'expected' => 'pointer-events: initial',
			],
			// See https://github.com/googleforcreators/web-stories-wp/pull/7380.
			[
				'css'      => 'will-change: transform',
				'expected' => 'will-change: transform',
			],
			// CSS calc().
			[
				'width: calc(2em + 3px)',
				'width: calc(2em + 3px)',
			],
			// CSS variable.
			[
				'padding: var(--wp-var1) var(--wp-var2)',
				'padding: var(--wp-var1) var(--wp-var2)',
			],
			// CSS calc() with var() custom property.
			[
				'margin-top: calc(var(--wp-var1) * 3 + 2em)',
				'margin-top: calc(var(--wp-var1) * 3 + 2em)',
			],
			// Malformed calc, no closing `)`.
			[
				'width: calc(3em + 10px',
				'',
			],
			// Malformed var, no closing `)`.
			[
				'width: var(--wp-var1',
				'',
			],
		];
	}

	/**
	 * Testing the filter_kses_allowed_html() method.
	 *
	 * @param string $html     HTML string.
	 * @param string $expected Expected output.
	 *
	 * @dataProvider data_test_filter_kses_allowed_html
	 * @covers ::filter_kses_allowed_html
	 * @covers ::add_global_attributes
	 * @covers ::array_merge_recursive_distinct
	 */
	public function test_filter_kses_allowed_html( $html, $expected ): void {
				add_filter( 'wp_kses_allowed_html', [ $this->instance, 'filter_kses_allowed_html' ] );

		$this->assertSame( $expected, wp_unslash( wp_filter_post_kses( $html ) ) );
		remove_filter( 'wp_kses_allowed_html', [ $this->instance, 'filter_kses_allowed_html' ] );
	}

	/**
	 * Testing the filter_kses_allowed_html() method.
	 *
	 * @covers ::filter_kses_allowed_html
	 * @covers ::array_merge_recursive_distinct
	 */
	public function test_filter_kses_allowed_html_uses_deep_merge(): void {
		$allowed_tags = [
			'img'     => [
				'width' => true,
			],
			'testing' => [
				'width' => true,
			],
		];

		$result = $this->instance->filter_kses_allowed_html( $allowed_tags );

		$this->assertArrayHasKey( 'img', $result );
		$this->assertArrayHasKey( 'width', $result['img'] );
		$this->assertArrayHasKey( 'intrinsicsize', $result['img'] );
		$this->assertArrayHasKey( 'testing', $result );
		$this->assertArrayHasKey( 'width', $result['testing'] );
	}

	public function data_test_filter_kses_allowed_html(): array {
		$blue_rings_svg = file_get_contents( WEB_STORIES_TEST_DATA_DIR . '/multipleBlueRings.svg' );

		return [
			'Video Element'                    => [
				'<amp-video autoplay="autoplay" poster="https://example.com/poster.png" artwork="https://example.com/poster.png" title="Some Video" alt="Some Video" layout="fill" id="foo"><source type="video/mp4" src="https://example.com/video.mp4"></source></amp-video>',
				'<amp-video autoplay="autoplay" poster="https://example.com/poster.png" artwork="https://example.com/poster.png" title="Some Video" alt="Some Video" layout="fill" id="foo"><source type="video/mp4" src="https://example.com/video.mp4"></source></amp-video>',
			],
			'Masking'                          => [
				'<svg width="0" height="0"><defs><clippath id="mask-foo" transform="scale(1 1)" clippathunits="objectBoundingBox"><path d="M 0.5 0 C 0.777344 0 1 0.222656 1 0.5 C 1 0.777344 0.777344 1 0.5 1 C 0.222656 1 0 0.777344 0 0.5 C 0 0.222656 0.222656 0 0.5 0 Z"></path></clippath></defs></svg></div>',
				'<svg width="0" height="0"><defs><clippath id="mask-foo" transform="scale(1 1)" clippathunits="objectBoundingBox"><path d="M 0.5 0 C 0.777344 0 1 0.222656 1 0.5 C 1 0.777344 0.777344 1 0.5 1 C 0.222656 1 0 0.777344 0 0.5 C 0 0.222656 0.222656 0 0.5 0 Z"></path></clippath></defs></svg></div>',
			],
			'ARIA Roles'                       => [
				'<div aria-describedby="foo"></div><div aria-details="bar"></div><div aria-label="Hello World"></div><div aria-labelledby="foo bar baz"></div><div aria-hidden="true"></div>',
				'<div aria-describedby="foo"></div><div aria-details="bar"></div><div aria-label="Hello World"></div><div aria-labelledby="foo bar baz"></div><div aria-hidden="true"></div>',
			],
			'Global Attributes'                => [
				'<div class="foo" id="bar" style="color: pink" role="main" title="Test"></div>',
				'<div class="foo" id="bar" style="color: pink" role="main" title="Test"></div>',
			],
			'Img Attributes'                   => [
				'<img src="http://www.example.com/test.jpg" alt="Example" height="200" width="500" />',
				'<img src="http://www.example.com/test.jpg" alt="Example" height="200" width="500" />',
			],
			'Data Attributes'                  => [
				'<a href="https://example.com" data-vars-tooltip-click-id="link1" data-vars-tooltip-href="example.com"></a>',
				'<a href="https://example.com" data-vars-tooltip-click-id="link1" data-vars-tooltip-href="example.com"></a>',
			],
			'AMP Layout'                       => [
				'<amp-img layout="fill" src="https://example.com/image.png" />',
				'<amp-img layout="fill" src="https://example.com/image.png" />',
			],
			'AMP Animations'                   => [
				'<p id="foo" animate-in="fly-in-left" animate-in-delay="0.3s" animate-in-duration="0.5s" animate-in-layout="nodisplay">Hello World</p><p id="bar" animate-in="fade-in" animate-in-after="foo">Hello World</p>',
				'<p id="foo" animate-in="fly-in-left" animate-in-delay="0.3s" animate-in-duration="0.5s" animate-in-layout="nodisplay">Hello World</p><p id="bar" animate-in="fade-in" animate-in-after="foo">Hello World</p>',
			],
			'AMP Story Animations'             => [
				'<amp-story-animation layout="nodisplay" trigger="visibility"><script type="application/json">[{"selector":"#anim-9d7bb1a9-8839-4629-b26c-d1863e675c36","keyframes":{"transform":["translate3d(-110.30303%, 0px, 0)","none"]},"fill":"forwards","duration":600,"delay":0,"easing":"cubic-bezier(0.4, 0.4, 0.0, 1)"}]</script></amp-story-animation>',
				'<amp-story-animation layout="nodisplay" trigger="visibility"><script type="application/json">[{"selector":"#anim-9d7bb1a9-8839-4629-b26c-d1863e675c36","keyframes":{"transform":["translate3d(-110.30303%, 0px, 0)","none"]},"fill":"forwards","duration":600,"delay":0,"easing":"cubic-bezier(0.4, 0.4, 0.0, 1)"}]</script></amp-story-animation>',
			],
			'Page Attachment'                  => [
				'<amp-story-page-attachment layout="nodisplay" href="https://www.example.com" data-cta-text="Read more" data-title="My title" theme="dark"></amp-story-page-attachment>',
				'<amp-story-page-attachment layout="nodisplay" href="https://www.example.com" data-cta-text="Read more" data-title="My title" theme="dark"></amp-story-page-attachment>',
			],
			'Images with disable-inline-width' => [
				'<amp-img layout="fill" src="https://example.com/image.jpg" alt="example" srcset="https://example.com/image.jpg 900w,https://example.com/image-768x1024.jpg 768w,https://example.com/image-640x853.jpg 640w,https://example.com/image-225x300.jpg 225w,https://example.com/image-150x200.jpg 150w" sizes="(min-width: 1024px) 14vh, 32vw" disable-inline-width="true"></amp-img>',
				'<amp-img layout="fill" src="https://example.com/image.jpg" alt="example" srcset="https://example.com/image.jpg 900w,https://example.com/image-768x1024.jpg 768w,https://example.com/image-640x853.jpg 640w,https://example.com/image-225x300.jpg 225w,https://example.com/image-150x200.jpg 150w" sizes="(min-width: 1024px) 14vh, 32vw" disable-inline-width="true"></amp-img>',
			],
			'Page Outlink'                     => [
				'<amp-story-page-outlink layout="nodisplay" theme="custom" cta-accent-color="#0047FF" cta-image="https://example.com/32x32icon.jpg" cta-accent-element="background"><a href="https://www.google.com">Read More</a></amp-story-page-outlink>',
				'<amp-story-page-outlink layout="nodisplay" theme="custom" cta-accent-color="#0047FF" cta-image="https://example.com/32x32icon.jpg" cta-accent-element="background"><a href="https://www.google.com">Read More</a></amp-story-page-outlink>',
			],
			'Complex SVG'                      => [
				$blue_rings_svg,
				$blue_rings_svg,
			],
			'Video Captions'                   => [
				'<amp-story-captions id="video-123-captions" layout="fixed-height" height="100" />',
				'<amp-story-captions id="video-123-captions" layout="fixed-height" height="100" />',
			],
			'Video with Captions ID'           => [
				'<amp-video autoplay="autoplay" poster="https://example.com/poster.png" artwork="https://example.com/poster.png" title="Some Video" alt="Some Video" layout="fill" id="foo" captions-id="foo-captions"><source type="video/mp4" src="https://example.com/video.mp4"></source></amp-video>',
				'<amp-video autoplay="autoplay" poster="https://example.com/poster.png" artwork="https://example.com/poster.png" title="Some Video" alt="Some Video" layout="fill" id="foo" captions-id="foo-captions"><source type="video/mp4" src="https://example.com/video.mp4"></source></amp-video>',
			],
			'Shopping'                         => [
				'<amp-story-shopping-tag data-product-id="lamp"></amp-story-shopping-tag><amp-story-shopping-attachment><script type="application/json">{}</script></amp-story-shopping-attachment>',
				'<amp-story-shopping-tag data-product-id="lamp"></amp-story-shopping-tag><amp-story-shopping-attachment><script type="application/json">{}</script></amp-story-shopping-attachment>',
			],
			'Shopping with cta-text'           => [
				'<amp-story-shopping-tag data-product-id="lamp"></amp-story-shopping-tag><amp-story-shopping-attachment cta-text="Shop Now!"><script type="application/json">{}</script></amp-story-shopping-attachment>',
				'<amp-story-shopping-tag data-product-id="lamp"></amp-story-shopping-tag><amp-story-shopping-attachment cta-text="Shop Now!"><script type="application/json">{}</script></amp-story-shopping-attachment>',
			],
		];
	}
}
