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

namespace Google\Web_Stories\Tests\Integration\AMP;

use DOMElement;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;
use Google\Web_Stories_Dependencies\AMP_Dev_Mode_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_Layout_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_Style_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_Tag_And_Attribute_Sanitizer;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Sanitization
 */
class Sanitization extends DependencyInjectedTestCase {
	/**
	 * @var \Google\Web_Stories\AMP\Sanitization
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\AMP\Sanitization::class );
	}

	public function tear_down(): void {
		remove_all_filters( 'web_stories_amp_sanitizers' );
		remove_all_filters( 'web_stories_amp_dev_mode_enabled' );
		remove_all_filters( 'web_stories_amp_dev_mode_element_xpaths' );
		remove_all_filters( 'show_admin_bar' );

		parent::tear_down();
	}

	/**
	 * @see Test_AMP_Theme_Support::test_scripts_get_moved_to_head
	 *
	 * @covers ::sanitize_document()
	 * @covers ::ensure_required_markup()
	 */
	public function test_scripts_get_moved_to_head(): void {
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

		$document = Document::fromHtml( $original_html );
		$this->instance->sanitize_document( $document );

		$scripts = $document->xpath->query( '//script[ not( @type ) or @type = "text/javascript" ]' );
		$this->assertSame( 2, $scripts->length );
		foreach ( $scripts as $script ) {
			$this->assertSame( 'head', $script->parentNode->nodeName );
		}
	}

	/**
	 * @see Test_AMP_Theme_Support::test_unneeded_scripts_get_removed
	 *
	 * @covers ::ensure_required_markup()
	 */
	public function test_unneeded_scripts_get_removed(): void {
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

		$document = Document::fromHtml( $original_html );
		$this->instance->sanitize_document( $document );

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
	 *
	 * @covers AMP_Theme_Support::prepare_response()
	 * @covers AMP_Theme_Support::ensure_required_markup()
	 */
	public function test_duplicate_scripts_are_removed(): void {
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

		$document = Document::fromHtml( $original_html );
		$this->instance->sanitize_document( $document );

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
	public function test_missing_scripts_get_added(): void {
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

		$document = Document::fromHtml( $original_html );
		$this->instance->sanitize_document( $document );

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
	public function test_get_extension_sources(): void {
		$sources = $this->call_private_method( $this->instance, 'get_extension_sources' );

		$actual = [];

		foreach ( $sources as $extension => $src ) {
			$actual[ $extension ] = str_replace( 'https://cdn.ampproject.org/', '', $src );
		}

		// This allows us to ensure that we catch any version changes in scripts.
		$expected = [
			'amp-3d-gltf'                  => 'v0/amp-3d-gltf-0.1.js',
			'amp-3q-player'                => 'v0/amp-3q-player-0.1.js',
			'amp-access'                   => 'v0/amp-access-0.1.js',
			'amp-access-fewcents'          => 'v0/amp-access-fewcents-0.1.js',
			'amp-access-laterpay'          => 'v0/amp-access-laterpay-0.2.js',
			'amp-access-poool'             => 'v0/amp-access-poool-0.1.js',
			'amp-access-scroll'            => 'v0/amp-access-scroll-0.1.js',
			'amp-accordion'                => 'v0/amp-accordion-0.1.js',
			'amp-action-macro'             => 'v0/amp-action-macro-0.1.js',
			'amp-ad'                       => 'v0/amp-ad-0.1.js',
			'amp-ad-custom'                => 'v0/amp-ad-custom-0.1.js',
			'amp-addthis'                  => 'v0/amp-addthis-0.1.js',
			'amp-analytics'                => 'v0/amp-analytics-0.1.js',
			'amp-anim'                     => 'v0/amp-anim-0.1.js',
			'amp-animation'                => 'v0/amp-animation-0.1.js',
			'amp-apester-media'            => 'v0/amp-apester-media-0.1.js',
			'amp-app-banner'               => 'v0/amp-app-banner-0.1.js',
			'amp-audio'                    => 'v0/amp-audio-0.1.js',
			'amp-auto-ads'                 => 'v0/amp-auto-ads-0.1.js',
			'amp-autocomplete'             => 'v0/amp-autocomplete-0.1.js',
			'amp-base-carousel'            => 'v0/amp-base-carousel-0.1.js',
			'amp-beopinion'                => 'v0/amp-beopinion-0.1.js',
			'amp-bind'                     => 'v0/amp-bind-0.1.js',
			'amp-bodymovin-animation'      => 'v0/amp-bodymovin-animation-0.1.js',
			'amp-brid-player'              => 'v0/amp-brid-player-0.1.js',
			'amp-brightcove'               => 'v0/amp-brightcove-0.1.js',
			'amp-byside-content'           => 'v0/amp-byside-content-0.1.js',
			'amp-cache-url'                => 'v0/amp-cache-url-0.1.js',
			'amp-call-tracking'            => 'v0/amp-call-tracking-0.1.js',
			// The AMP plugin forces this to be 0.2, but we don't need that.
			// See https://github.com/ampproject/amp-wp/blob/d2d441cf6f1f4e9a7268a9c6e3360be309852a2c/includes/amp-helper-functions.php#L918-L925.
			'amp-carousel'                 => 'v0/amp-carousel-0.1.js',
			'amp-connatix-player'          => 'v0/amp-connatix-player-0.1.js',
			'amp-consent'                  => 'v0/amp-consent-0.1.js',
			'amp-dailymotion'              => 'v0/amp-dailymotion-0.1.js',
			'amp-date-countdown'           => 'v0/amp-date-countdown-0.1.js',
			'amp-date-display'             => 'v0/amp-date-display-0.1.js',
			'amp-date-picker'              => 'v0/amp-date-picker-0.1.js',
			'amp-delight-player'           => 'v0/amp-delight-player-0.1.js',
			'amp-dynamic-css-classes'      => 'v0/amp-dynamic-css-classes-0.1.js',
			'amp-embedly-card'             => 'v0/amp-embedly-card-0.1.js',
			'amp-experiment'               => 'v0/amp-experiment-0.1.js',
			'amp-facebook'                 => 'v0/amp-facebook-0.1.js',
			'amp-facebook-comments'        => 'v0/amp-facebook-comments-0.1.js',
			'amp-facebook-like'            => 'v0/amp-facebook-like-0.1.js',
			'amp-facebook-page'            => 'v0/amp-facebook-page-0.1.js',
			'amp-fit-text'                 => 'v0/amp-fit-text-0.1.js',
			'amp-font'                     => 'v0/amp-font-0.1.js',
			'amp-form'                     => 'v0/amp-form-0.1.js',
			'amp-fx-collection'            => 'v0/amp-fx-collection-0.1.js',
			'amp-fx-flying-carpet'         => 'v0/amp-fx-flying-carpet-0.1.js',
			'amp-geo'                      => 'v0/amp-geo-0.1.js',
			'amp-gfycat'                   => 'v0/amp-gfycat-0.1.js',
			'amp-gist'                     => 'v0/amp-gist-0.1.js',
			'amp-google-document-embed'    => 'v0/amp-google-document-embed-0.1.js',
			'amp-google-read-aloud-player' => 'v0/amp-google-read-aloud-player-0.1.js',
			'amp-hulu'                     => 'v0/amp-hulu-0.1.js',
			'amp-iframe'                   => 'v0/amp-iframe-0.1.js',
			'amp-iframely'                 => 'v0/amp-iframely-0.1.js',
			'amp-ima-video'                => 'v0/amp-ima-video-0.1.js',
			'amp-image-lightbox'           => 'v0/amp-image-lightbox-0.1.js',
			'amp-image-slider'             => 'v0/amp-image-slider-0.1.js',
			'amp-imgur'                    => 'v0/amp-imgur-0.1.js',
			'amp-inline-gallery'           => 'v0/amp-inline-gallery-0.1.js',
			'amp-inputmask'                => 'v0/amp-inputmask-0.1.js',
			'amp-instagram'                => 'v0/amp-instagram-0.1.js',
			'amp-install-serviceworker'    => 'v0/amp-install-serviceworker-0.1.js',
			'amp-izlesene'                 => 'v0/amp-izlesene-0.1.js',
			'amp-jwplayer'                 => 'v0/amp-jwplayer-0.1.js',
			'amp-kaltura-player'           => 'v0/amp-kaltura-player-0.1.js',
			'amp-lightbox'                 => 'v0/amp-lightbox-0.1.js',
			'amp-lightbox-gallery'         => 'v0/amp-lightbox-gallery-0.1.js',
			'amp-link-rewriter'            => 'v0/amp-link-rewriter-0.1.js',
			'amp-list'                     => 'v0/amp-list-0.1.js',
			'amp-live-list'                => 'v0/amp-live-list-0.1.js',
			'amp-mathml'                   => 'v0/amp-mathml-0.1.js',
			'amp-mega-menu'                => 'v0/amp-mega-menu-0.1.js',
			'amp-megaphone'                => 'v0/amp-megaphone-0.1.js',
			'amp-minute-media-player'      => 'v0/amp-minute-media-player-0.1.js',
			'amp-mowplayer'                => 'v0/amp-mowplayer-0.1.js',
			'amp-mustache'                 => 'v0/amp-mustache-0.2.js',
			'amp-nested-menu'              => 'v0/amp-nested-menu-0.1.js',
			'amp-next-page'                => 'v0/amp-next-page-1.0.js',
			'amp-nexxtv-player'            => 'v0/amp-nexxtv-player-0.1.js',
			'amp-o2-player'                => 'v0/amp-o2-player-0.1.js',
			'amp-onetap-google'            => 'v0/amp-onetap-google-0.1.js',
			'amp-ooyala-player'            => 'v0/amp-ooyala-player-0.1.js',
			'amp-orientation-observer'     => 'v0/amp-orientation-observer-0.1.js',
			'amp-pan-zoom'                 => 'v0/amp-pan-zoom-0.1.js',
			'amp-pinterest'                => 'v0/amp-pinterest-0.1.js',
			'amp-playbuzz'                 => 'v0/amp-playbuzz-0.1.js',
			'amp-position-observer'        => 'v0/amp-position-observer-0.1.js',
			'amp-powr-player'              => 'v0/amp-powr-player-0.1.js',
			'amp-reach-player'             => 'v0/amp-reach-player-0.1.js',
			'amp-recaptcha-input'          => 'v0/amp-recaptcha-input-0.1.js',
			'amp-redbull-player'           => 'v0/amp-redbull-player-0.1.js',
			'amp-reddit'                   => 'v0/amp-reddit-0.1.js',
			'amp-render'                   => 'v0/amp-render-1.0.js',
			'amp-riddle-quiz'              => 'v0/amp-riddle-quiz-0.1.js',
			'amp-script'                   => 'v0/amp-script-0.1.js',
			'amp-selector'                 => 'v0/amp-selector-0.1.js',
			'amp-sidebar'                  => 'v0/amp-sidebar-0.1.js',
			'amp-skimlinks'                => 'v0/amp-skimlinks-0.1.js',
			'amp-smartlinks'               => 'v0/amp-smartlinks-0.1.js',
			'amp-social-share'             => 'v0/amp-social-share-0.1.js',
			'amp-soundcloud'               => 'v0/amp-soundcloud-0.1.js',
			'amp-springboard-player'       => 'v0/amp-springboard-player-0.1.js',
			'amp-sticky-ad'                => 'v0/amp-sticky-ad-1.0.js',
			'amp-story'                    => 'v0/amp-story-1.0.js',
			'amp-story-360'                => 'v0/amp-story-360-0.1.js',
			'amp-story-auto-ads'           => 'v0/amp-story-auto-ads-0.1.js',
			'amp-story-auto-analytics'     => 'v0/amp-story-auto-analytics-0.1.js',
			'amp-story-captions'           => 'v0/amp-story-captions-0.1.js',
			'amp-story-interactive'        => 'v0/amp-story-interactive-0.1.js',
			'amp-story-panning-media'      => 'v0/amp-story-panning-media-0.1.js',
			'amp-story-player'             => 'v0/amp-story-player-0.1.js',
			'amp-story-shopping'           => 'v0/amp-story-shopping-0.1.js',
			'amp-story-subscriptions'      => 'v0/amp-story-subscriptions-0.1.js',
			'amp-stream-gallery'           => 'v0/amp-stream-gallery-0.1.js',
			'amp-subscriptions'            => 'v0/amp-subscriptions-0.1.js',
			'amp-subscriptions-google'     => 'v0/amp-subscriptions-google-0.1.js',
			'amp-tiktok'                   => 'v0/amp-tiktok-0.1.js',
			'amp-timeago'                  => 'v0/amp-timeago-0.1.js',
			'amp-truncate-text'            => 'v0/amp-truncate-text-0.1.js',
			'amp-twitter'                  => 'v0/amp-twitter-0.1.js',
			'amp-user-notification'        => 'v0/amp-user-notification-0.1.js',
			'amp-video'                    => 'v0/amp-video-0.1.js',
			'amp-video-docking'            => 'v0/amp-video-docking-0.1.js',
			'amp-video-iframe'             => 'v0/amp-video-iframe-0.1.js',
			'amp-vimeo'                    => 'v0/amp-vimeo-0.1.js',
			'amp-vine'                     => 'v0/amp-vine-0.1.js',
			'amp-viqeo-player'             => 'v0/amp-viqeo-player-0.1.js',
			'amp-vk'                       => 'v0/amp-vk-0.1.js',
			'amp-web-push'                 => 'v0/amp-web-push-0.1.js',
			'amp-wistia-player'            => 'v0/amp-wistia-player-0.1.js',
			'amp-wordpress-embed'          => 'v0/amp-wordpress-embed-1.0.js',
			'amp-yotpo'                    => 'v0/amp-yotpo-0.1.js',
			'amp-youtube'                  => 'v0/amp-youtube-0.1.js',
		];

		foreach ( $sources as $extension => $src ) {
			$this->assertStringStartsWith( 'amp-', $extension );
			$this->assertStringStartsWith( 'https://cdn.ampproject.org/v0/', $src );
		}

		$this->assertEqualSetsWithIndex( $expected, $actual );
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_is_dev_mode
	 *
	 * @covers ::is_amp_dev_mode
	 */
	public function test_is_amp_dev_mode(): void {

		$this->assertFalse( $this->call_private_method( $this->instance, 'is_amp_dev_mode' ) );
		add_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );
		$this->assertTrue( $this->call_private_method( $this->instance, 'is_amp_dev_mode' ) );
		remove_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );
		$this->assertFalse( $this->call_private_method( $this->instance, 'is_amp_dev_mode' ) );
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_is_dev_mode
	 *
	 * @covers ::is_amp_dev_mode
	 */
	public function test_is_amp_dev_mode_authenticated_user_admin_bar_showing(): void {
		add_filter( 'show_admin_bar', '__return_true' );

		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$this->assertTrue( is_admin_bar_showing() );
		$this->assertTrue( is_user_logged_in() );
		$this->assertTrue( $this->call_private_method( $this->instance, 'is_amp_dev_mode' ) );
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_is_dev_mode
	 *
	 * @covers ::is_amp_dev_mode
	 */
	public function test_is_amp_dev_mode_unauthenticated_user_admin_bar_forced(): void {
		// Test unauthenticated user with admin bar forced.
		add_filter( 'show_admin_bar', '__return_true' );
		wp_set_current_user( 0 );

		$this->assertFalse( is_user_logged_in() );
		$this->assertTrue( is_admin_bar_showing() );
		$this->assertFalse( $this->call_private_method( $this->instance, 'is_amp_dev_mode' ) );
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_get_content_sanitizers
	 *
	 * @covers ::get_sanitizers
	 */
	public function test_get_sanitizers(): void {
		// Make sure the style and validating sanitizers are always at the end, even after filtering.
		add_filter(
			'web_stories_amp_sanitizers',
			static function( $sanitizers ) {
				$sanitizers['Even_After_Validating_Sanitizer'] = [];
				return $sanitizers;
			}
		);

		$sanitizers = $this->call_private_method( $this->instance, 'get_sanitizers' );

		$ordered_sanitizers = array_keys( $sanitizers );
		$this->assertEquals( 'Even_After_Validating_Sanitizer', $ordered_sanitizers[ \count( $ordered_sanitizers ) - 5 ] );
		$this->assertEquals( AMP_Layout_Sanitizer::class, $ordered_sanitizers[ \count( $ordered_sanitizers ) - 4 ] );
		$this->assertEquals( AMP_Style_Sanitizer::class, $ordered_sanitizers[ \count( $ordered_sanitizers ) - 3 ] );
		$this->assertEquals( \Google\Web_Stories\AMP\Meta_Sanitizer::class, $ordered_sanitizers[ \count( $ordered_sanitizers ) - 2 ] );
		$this->assertEquals( AMP_Tag_And_Attribute_Sanitizer::class, $ordered_sanitizers[ \count( $ordered_sanitizers ) - 1 ] );
	}

	/**
	 * @see Test_AMP_Helper_Functions::test_amp_get_content_sanitizers_with_dev_mode
	 *
	 * @covers ::get_sanitizers
	 */
	public function test_get_sanitizers_with_dev_mode(): void {
		$element_xpaths            = [ '//script[ @id = "hello-world" ]' ];
		$validation_error_callback = [ $this->instance, 'validation_error_callback' ];
		add_filter(
			'web_stories_amp_dev_mode_element_xpaths',
			function ( $xpaths ) use ( $element_xpaths ) {
				return array_merge( $xpaths, $element_xpaths );
			}
		);

		// Check that AMP_Dev_Mode_Sanitizer is not registered if not in dev mode.
		$sanitizers = $this->call_private_method( $this->instance, 'get_sanitizers' );
		$this->assertFalse( $this->call_private_method( $this->instance, 'is_amp_dev_mode' ) );
		$this->assertArrayNotHasKey( AMP_Dev_Mode_Sanitizer::class, $sanitizers );

		// Check that AMP_Dev_Mode_Sanitizer is registered once in dev mode, but not with admin bar showing yet.
		add_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );
		$sanitizers = $this->call_private_method( $this->instance, 'get_sanitizers' );
		$this->assertFalse( is_admin_bar_showing() );
		$this->assertTrue( $this->call_private_method( $this->instance, 'is_amp_dev_mode' ) );
		$this->assertArrayHasKey( AMP_Dev_Mode_Sanitizer::class, $sanitizers );
		$this->assertEquals( AMP_Dev_Mode_Sanitizer::class, current( array_keys( $sanitizers ) ) );
		$this->assertEquals(
			compact( 'element_xpaths', 'validation_error_callback' ),
			$sanitizers[ AMP_Dev_Mode_Sanitizer::class ]
		);
		remove_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );

		// Check that AMP_Dev_Mode_Sanitizer is registered once in dev mode, and now also with admin bar showing.
		add_filter( 'web_stories_amp_dev_mode_enabled', '__return_true' );
		add_filter( 'show_admin_bar', '__return_true' );

		$sanitizers = $this->call_private_method( $this->instance, 'get_sanitizers' );

		$this->assertTrue( is_admin_bar_showing() );
		$this->assertTrue( $this->call_private_method( $this->instance, 'is_amp_dev_mode' ) );
		$this->assertArrayHasKey( AMP_Dev_Mode_Sanitizer::class, $sanitizers );
		$this->assertEqualSets(
			array_merge(
				$element_xpaths,
				[
					'//*[ @id = "wpadminbar" ]',
					'//*[ @id = "wpadminbar" ]//*',
					'//style[ @id = "admin-bar-inline-css" ]',
				]
			),
			$sanitizers[ AMP_Dev_Mode_Sanitizer::class ]['element_xpaths']
		);
	}

	/**
	 * @covers \Google\Web_Stories\Integrations\AMP::filter_amp_validation_error_sanitized
	 */
	public function test_sanitize_amp_video_with_missing_poster(): void {
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

		$document = Document::fromHtml( $original_html );
		$this->instance->sanitize_document( $document );

		$video_element = $document->body->getElementsByTagName( 'amp-video' )->item( 0 );
		$this->assertInstanceOf( DOMElement::class, $video_element );
	}

	/**
	 * @covers \Google\Web_Stories\Integrations\AMP::filter_amp_validation_error_sanitized
	 */
	public function test_sanitize_amp_video_with_http_source(): void {
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

		$document = Document::fromHtml( $original_html );
		$this->instance->sanitize_document( $document );

		$video_element = $document->body->getElementsByTagName( 'amp-video' )->item( 0 );
		$this->assertInstanceOf( DOMElement::class, $video_element );
	}
}
