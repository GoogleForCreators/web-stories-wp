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

namespace Google\Web_Stories\Tests\AMP;

use DOMElement;
use Google\Web_Stories_Dependencies\AMP_Layout_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_Style_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_Tag_And_Attribute_Sanitizer;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Google\Web_Stories\Tests\Test_Case;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Sanitization
 */
class Sanitization extends Test_Case {
	public function tearDown() {
		remove_all_filters( 'web_stories_amp_sanitizers' );
		remove_all_filters( 'web_stories_amp_dev_mode_enabled' );
		remove_all_filters( 'web_stories_amp_dev_mode_element_xpaths' );
		remove_all_filters( 'show_admin_bar' );

		unset( $GLOBALS['show_admin_bar'] );

		parent::tearDown();
	}

	/**
	 * @see Test_AMP_Theme_Support::test_scripts_get_moved_to_head
	 * @covers ::sanitize_document()
	 * @covers ::ensure_required_markup()
	 */
	public function test_scripts_get_moved_to_head() {
		ob_start();
		?>
		<html>
		<head>
		</head>
		<body>
		<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png">
			<amp-story-page id="foo">
				<amp-story-grid-layer template="fill">
				</amp-story-grid-layer>
			</amp-story-page>
		</amp-story>
		<script async="" src="https://cdn.ampproject.org/v0.js"></script>
		<script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>
		</body>
		</html>
		<?php
		$original_html = ob_get_clean();

		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		$document = Document::fromHtml( $original_html );
		$sanitization->sanitize_document( $document );

		$scripts = $document->xpath->query( '//script[ not( @type ) or @type = "text/javascript" ]' );
		$this->assertSame( 2, $scripts->length );
		foreach ( $scripts as $script ) {
			$this->assertSame( 'head', $script->parentNode->nodeName );
		}
	}

	/**
	 * @see Test_AMP_Theme_Support::test_unneeded_scripts_get_removed
	 * @covers ::ensure_required_markup()
	 */
	public function test_unneeded_scripts_get_removed() {
		ob_start();
		?>
		<html>
		<head></head>
		<body>
		<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png">
			<amp-story-page id="foo">
				<amp-story-grid-layer template="fill">
				</amp-story-grid-layer>
			</amp-story-page>
		</amp-story>
		<script async="" src="https://cdn.ampproject.org/v0.js"></script>
		<script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>
		<script src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js" async="" custom-element="amp-analytics"></script>
		</body>
		</html>
		<?php
		$original_html = ob_get_clean();

		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		$document = Document::fromHtml( $original_html );
		$sanitization->sanitize_document( $document );

		/** @var DOMElement $script Script. */
		$actual_script_srcs = [];
		foreach ( $document->xpath->query( '//script[ not( @type ) or @type = "text/javascript" ]' ) as $script ) {
			$actual_script_srcs[] = $script->getAttribute( 'src' );
		}

		$expected_script_srcs = [
			'https://cdn.ampproject.org/v0.js',
			'https://cdn.ampproject.org/v0/amp-story-1.0.js',
		];

		$this->assertEqualSets(
			$expected_script_srcs,
			$actual_script_srcs
		);
	}

	/**
	 * @see Test_AMP_Theme_Support::test_duplicate_scripts_are_removed
	 * @covers AMP_Theme_Support::prepare_response()
	 * @covers AMP_Theme_Support::ensure_required_markup()
	 */
	public function test_duplicate_scripts_are_removed() {
		ob_start();
		?>
		<html>
		<head>
			<script async="" src="https://cdn.ampproject.org/v0.js"></script>
			<script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>
			<script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>
			<script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>
		</head>
		<body>
		<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png">
			<amp-story-page id="foo">
				<amp-story-grid-layer template="fill">
				</amp-story-grid-layer>
			</amp-story-page>
		</amp-story>
		</body>
		</html>
		<?php
		$original_html = ob_get_clean();

		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		$document = Document::fromHtml( $original_html );
		$sanitization->sanitize_document( $document );

		$script_srcs = [];

		/**
		 * Script.
		 *
		 * @var DOMElement $script
		 */
		$scripts = $document->xpath->query( '//script[ @src ]' );
		foreach ( $scripts as $script ) {
			$script_srcs[] = $script->getAttribute( 'src' );
		}

		$this->assertCount( 2, $script_srcs );
		$this->assertEquals(
			$script_srcs,
			[
				'https://cdn.ampproject.org/v0.js',
				'https://cdn.ampproject.org/v0/amp-story-1.0.js',
			]
		);
	}

	/**
	 * @covers ::ensure_required_markup()
	 */
	public function test_missing_scripts_get_added() {
		ob_start();
		?>
		<html>
		<head></head>
		<body>
		<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png">
			<amp-story-page id="foo">
				<amp-story-grid-layer template="fill">
				</amp-story-grid-layer>
			</amp-story-page>
			<amp-analytics type="gtag" data-credentials="include">
				<script type="application/json">{}</script>
			</amp-analytics>
		</amp-story>
		<script async="" src="https://cdn.ampproject.org/v0.js"></script>
		<script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>
		</body>
		</html>
		<?php
		$original_html = ob_get_clean();

		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		$document = Document::fromHtml( $original_html );
		$sanitization->sanitize_document( $document );

		/** @var DOMElement $script Script. */
		$actual_script_srcs = [];
		foreach ( $document->xpath->query( '//script[ not( @type ) or @type = "text/javascript" ]' ) as $script ) {
			$actual_script_srcs[] = $script->getAttribute( 'src' );
		}

		$expected_script_srcs = [
			'https://cdn.ampproject.org/v0.js',
			'https://cdn.ampproject.org/v0/amp-story-1.0.js',
			'https://cdn.ampproject.org/v0/amp-analytics-0.1.js',
		];

		$this->assertEqualSets(
			$expected_script_srcs,
			$actual_script_srcs
		);
	}

	/**
	 * @covers ::get_extension_sources
	 */
	public function test_get_extension_sources() {
		$sanitization = new \Google\Web_Stories\AMP\Sanitization();
		$sources      = $this->call_private_method( $sanitization, 'get_extension_sources' );

		foreach ( $sources as $extension => $src ) {
			$this->assertStringStartsWith( 'amp-', $extension );
			$this->assertStringStartsWith( 'https://cdn.ampproject.org/v0/', $src );
		}
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_is_dev_mode
	 * @covers ::is_amp_dev_mode
	 */
	public function test_is_amp_dev_mode() {
		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		$this->assertFalse( $this->call_private_method( $sanitization, 'is_amp_dev_mode' ) );
		add_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );
		$this->assertTrue( $this->call_private_method( $sanitization, 'is_amp_dev_mode' ) );
		remove_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );
		$this->assertFalse( $this->call_private_method( $sanitization, 'is_amp_dev_mode' ) );
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_is_dev_mode
	 * @covers ::is_amp_dev_mode
	 */
	public function test_is_amp_dev_mode_authenticated_user_admin_bar_showing() {
		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		add_filter( 'show_admin_bar', '__return_true' );
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$this->assertTrue( is_admin_bar_showing() );
		$this->assertTrue( is_user_logged_in() );
		$this->assertTrue( $this->call_private_method( $sanitization, 'is_amp_dev_mode' ) );
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_is_dev_mode
	 * @covers ::is_amp_dev_mode
	 */
	public function test_is_amp_dev_mode_unauthenticated_user_admin_bar_forced() {
		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		// Test unauthenticated user with admin bar forced.
		add_filter( 'show_admin_bar', '__return_true' );
		wp_set_current_user( 0 );

		$this->assertFalse( is_user_logged_in() );
		$this->assertTrue( is_admin_bar_showing() );
		$this->assertFalse( $this->call_private_method( $sanitization, 'is_amp_dev_mode' ) );
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_get_content_sanitizers
	 * @covers ::get_sanitizers
	 */
	public function test_get_sanitizers() {
		// Make sure the style and validating sanitizers are always at the end, even after filtering.
		add_filter(
			'web_stories_amp_sanitizers',
			static function( $sanitizers ) {
				$sanitizers['Even_After_Validating_Sanitizer'] = [];
				return $sanitizers;
			}
		);

		$sanitization = new \Google\Web_Stories\AMP\Sanitization();
		$sanitizers   = $this->call_private_method( $sanitization, 'get_sanitizers' );

		$ordered_sanitizers = array_keys( $sanitizers );
		$this->assertEquals( 'Even_After_Validating_Sanitizer', $ordered_sanitizers[ count( $ordered_sanitizers ) - 5 ] );
		$this->assertEquals( AMP_Layout_Sanitizer::class, $ordered_sanitizers[ count( $ordered_sanitizers ) - 4 ] );
		$this->assertEquals( AMP_Style_Sanitizer::class, $ordered_sanitizers[ count( $ordered_sanitizers ) - 3 ] );
		$this->assertEquals( \Google\Web_Stories\AMP\Meta_Sanitizer::class, $ordered_sanitizers[ count( $ordered_sanitizers ) - 2 ] );
		$this->assertEquals( AMP_Tag_And_Attribute_Sanitizer::class, $ordered_sanitizers[ count( $ordered_sanitizers ) - 1 ] );
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_get_content_sanitizers_with_dev_mode
	 * @covers ::get_sanitizers
	 */
	public function test_get_sanitizers_with_dev_mode() {
		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		$element_xpaths            = [ '//script[ @id = "hello-world" ]' ];
		$validation_error_callback = [ $sanitization, 'validation_error_callback' ];
		add_filter(
			'web_stories_amp_dev_mode_element_xpaths',
			function ( $xpaths ) use ( $element_xpaths ) {
				return array_merge( $xpaths, $element_xpaths );
			}
		);

		// Check that AMP_Dev_Mode_Sanitizer is not registered if not in dev mode.
		$sanitizers = $this->call_private_method( $sanitization, 'get_sanitizers' );
		$this->assertFalse( $this->call_private_method( $sanitization, 'is_amp_dev_mode' ) );
		$this->assertArrayNotHasKey( 'AMP_Dev_Mode_Sanitizer', $sanitizers );

		// Check that AMP_Dev_Mode_Sanitizer is registered once in dev mode, but not with admin bar showing yet.
		add_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );
		$sanitizers = $this->call_private_method( $sanitization, 'get_sanitizers' );
		$this->assertFalse( is_admin_bar_showing() );
		$this->assertTrue( $this->call_private_method( $sanitization, 'is_amp_dev_mode' ) );
		$this->assertArrayHasKey( 'AMP_Dev_Mode_Sanitizer', $sanitizers );
		$this->assertEquals( 'AMP_Dev_Mode_Sanitizer', current( array_keys( $sanitizers ) ) );
		$this->assertEquals(
			compact( 'element_xpaths', 'validation_error_callback' ),
			$sanitizers['AMP_Dev_Mode_Sanitizer']
		);
		remove_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );

		// Check that AMP_Dev_Mode_Sanitizer is registered once in dev mode, and now also with admin bar showing.
		add_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );
		add_filter( 'show_admin_bar', '__return_true' );

		$sanitizers = $this->call_private_method( $sanitization, 'get_sanitizers' );

		$this->assertTrue( is_admin_bar_showing() );
		$this->assertTrue( $this->call_private_method( $sanitization, 'is_amp_dev_mode' ) );
		$this->assertArrayHasKey( 'AMP_Dev_Mode_Sanitizer', $sanitizers );
		$this->assertEqualSets(
			array_merge(
				$element_xpaths,
				[
					'//*[ @id = "wpadminbar" ]',
					'//*[ @id = "wpadminbar" ]//*',
					'//style[ @id = "admin-bar-inline-css" ]',
				]
			),
			$sanitizers['AMP_Dev_Mode_Sanitizer']['element_xpaths']
		);
	}

	/**
	 * @covers \Google\Web_Stories\Integrations\AMP::filter_amp_validation_error_sanitized
	 */
	public function test_sanitize_amp_video_with_missing_poster() {
		ob_start();
		?>
		<html>
		<head>
		<script async="" src="https://cdn.ampproject.org/v0.js"></script>
		<script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>
		</head>
		<body>
		<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png">
			<amp-story-page id="foo">
				<amp-story-grid-layer template="fill">
					<amp-video autoplay="autoplay" title="Some Video" alt="Some Video" layout="fill" id="foo"><source type="video/mp4" src="https://example.com/video.mp4"/></amp-video>
				</amp-story-grid-layer>
			</amp-story-page>
		</amp-story>
		</body>
		</html>
		<?php
		$original_html = ob_get_clean();

		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		$document = Document::fromHtml( $original_html );
		$sanitization->sanitize_document( $document );

		$video_element = $document->body->getElementsByTagName( 'amp-video' )->item( 0 );
		$this->assertInstanceOf( DOMElement::class, $video_element );
	}

	/**
	 * @covers \Google\Web_Stories\Integrations\AMP::filter_amp_validation_error_sanitized
	 */
	public function test_sanitize_amp_video_with_http_source() {
		ob_start();
		?>
		<html>
		<head>
			<script async="" src="https://cdn.ampproject.org/v0.js"></script>
			<script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script>
		</head>
		<body>
		<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png">
			<amp-story-page id="foo">
				<amp-story-grid-layer template="fill">
					<amp-video autoplay="autoplay" title="Some Video" alt="Some Video" layout="fill" poster="https://example.com/poster.png"><source type="video/mp4" src="http://example.com/video.mp4"/></amp-video>
				</amp-story-grid-layer>
			</amp-story-page>
		</amp-story>
		</body>
		</html>
		<?php
		$original_html = ob_get_clean();

		$sanitization = new \Google\Web_Stories\AMP\Sanitization();

		$document = Document::fromHtml( $original_html );
		$sanitization->sanitize_document( $document );

		$video_element = $document->body->getElementsByTagName( 'amp-video' )->item( 0 );
		$this->assertInstanceOf( DOMElement::class, $video_element );
	}
}
