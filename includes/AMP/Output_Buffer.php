<?php
/**
 * Class Output_Buffer
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

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

namespace Google\Web_Stories\AMP;

use DOMElement;
use Exception;
use Google\Web_Stories\Experiments;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Publisher;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Throwable;
use WP_Post;

/**
 * Output buffer class.
 *
 * Largely copied from AMP_Theme_Support.
 *
 * @since 1.10.0
 *
 * @see \AMP_Theme_Support
 */
class Output_Buffer extends Service_Base {
	use Publisher;

	/**
	 * Whether output buffering has started.
	 *
	 * @var bool
	 */
	protected $is_output_buffering = false;

	/**
	 * Experiments instance.
	 *
	 * @var Experiments Experiments instance.
	 */
	private $experiments;

	/**
	 * Sanitization instance.
	 *
	 * @var Sanitization Sanitization instance.
	 */
	private $sanitization;

	/**
	 * Optimization instance.
	 *
	 * @var Optimization Optimization instance.
	 */
	private $optimization;

	/**
	 * HTML constructor.
	 *
	 * @since 1.10.0
	 *
	 * @param Experiments  $experiments  Experiments instance.
	 * @param Sanitization $sanitization Sanitization instance.
	 * @param Optimization $optimization Optimization instance.
	 */
	public function __construct( Experiments $experiments, Sanitization $sanitization, Optimization $optimization ) {
		$this->experiments  = $experiments;
		$this->sanitization = $sanitization;
		$this->optimization = $optimization;
	}

	/**
	 * Runs on instantiation.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	public function register() {
		/*
		 * Start output buffering at very low priority for sake of plugins and themes that use template_redirect
		 * instead of template_include.
		 */
		$priority = defined( 'PHP_INT_MIN' ) ? PHP_INT_MIN : ~PHP_INT_MAX; // phpcs:ignore PHPCompatibility.Constants.NewConstants.php_int_minFound
		add_action( 'template_redirect', [ $this, 'start_output_buffering' ], $priority );

		add_filter( 'web_stories_amp_sanitizers', [ $this, 'add_web_stories_amp_content_sanitizers' ] );
	}

	/**
	 * Check whether the conditional object is currently needed.
	 *
	 * @since 1.10.0
	 *
	 * @return bool Whether the conditional object is needed.
	 */
	public static function is_needed(): bool {
		// If the AMP plugin is installed and available in a version >= than ours,
		// all sanitization and optimization should be delegated to the AMP plugin.
		return ! ( defined( '\AMP__VERSION' ) || version_compare( AMP__VERSION, WEBSTORIES_AMP_VERSION, '<' ) );
	}

	/**
	 * Start output buffering.
	 *
	 * @since 1.10.0
	 *
	 * @see Sanitization::finish_output_buffering()
	 *
	 * @return void
	 */
	public function start_output_buffering() {
		if ( ! is_singular( Story_Post_Type::POST_TYPE_SLUG ) ) {
			return;
		}

		/*
		 * Disable the New Relic Browser agent on AMP responses.
		 * This prevents the New Relic from causing invalid AMP responses due the NREUM script it injects after the meta charset:
		 * https://docs.newrelic.com/docs/browser/new-relic-browser/troubleshooting/google-amp-validator-fails-due-3rd-party-script
		 * Sites with New Relic will need to specially configure New Relic for AMP:
		 * https://docs.newrelic.com/docs/browser/new-relic-browser/installation/monitor-amp-pages-new-relic-browser
		 */
		if ( function_exists( 'newrelic_disable_autorum' ) ) {
			newrelic_disable_autorum();
		}

		ob_start( [ $this, 'finish_output_buffering' ] );
		$this->is_output_buffering = true;
	}

	/**
	 * Determine whether output buffering has started.
	 *
	 * @since 1.10.0
	 *
	 * @see Sanitization::start_output_buffering()
	 * @see Sanitization::finish_output_buffering()
	 *
	 * @return bool Whether output buffering has started.
	 */
	public function is_output_buffering(): bool {
		return $this->is_output_buffering;
	}

	/**
	 * Finish output buffering.
	 *
	 * @since 1.10.0
	 *
	 * @see Sanitization::start_output_buffering()
	 *
	 * @param string $response Buffered Response.
	 * @return string Processed Response.
	 */
	public function finish_output_buffering( string $response ): string {
		$this->is_output_buffering = false;

		try {
			$response = $this->prepare_response( $response );
		} catch ( \Error $error ) { // Only PHP 7+.
			$response = $this->render_error_page( $error );
		} catch ( Exception $exception ) {
			$response = $this->render_error_page( $exception );
		}

		return $response;
	}

	/**
	 * Process response to ensure AMP validity.
	 *
	 * @since 1.10.0
	 *
	 * @param string $response HTML document response. By default it expects a complete document.
	 * @return string AMP document response.
	 */
	public function prepare_response( string $response ): string {
		// Enforce UTF-8 encoding as it is a requirement for AMP.
		if ( ! headers_sent() ) {
			header( 'Content-Type: text/html; charset=utf-8' );
		}

		/**
		 * Document.
		 *
		 * @var Document $dom Document.
		 */
		$dom = Document::fromHtml( $response );

		if ( ! $dom instanceof Document ) {
			return $this->render_error_page( new Exception() );
		}

		// Make sure scripts from the body get moved to the head.
		// TODO: Move to its own sanitizer?

		/**
		 * Scripts in <body>.
		 *
		 * @var DOMElement[] $scripts List of scripts.
		 */
		$scripts = $dom->xpath->query( '//body//script[ @custom-element or @custom-template or @src = "https://cdn.ampproject.org/v0.js" ]' );

		foreach ( $scripts as $script ) {
			if ( $script->parentNode ) {
				$dom->head->appendChild( $script->parentNode->removeChild( $script ) );
			}
		}

		$this->sanitization->sanitize_document( $dom );
		$this->optimization->optimize_document( $dom );

		return $dom->saveHTML();
	}


	/**
	 * Render error page.
	 *
	 * @todo Improve error message.
	 *
	 * @since 1.10.0
	 *
	 * @param Throwable $throwable Exception or (as of PHP7) Error.
	 * @return string Error page.
	 */
	private function render_error_page( Throwable $throwable ): string {
		return esc_html__( 'There was an error generating the web story, probably because of a server misconfiguration. Try contacting your hosting provider or open a new support request.', 'web-stories' );
	}

	/**
	 * Filters the Web Stories AMP sanitizers.
	 *
	 * @since 1.10.0
	 *
	 * @param array $sanitizers Sanitizers.
	 * @return array Sanitizers.
	 */
	public function add_web_stories_amp_content_sanitizers( $sanitizers ): array {
		if ( ! is_singular( 'web-story' ) ) {
			return $sanitizers;
		}

		$post = get_queried_object();

		if ( ! ( $post instanceof WP_Post ) ) {
			return $sanitizers;
		}

		$video_cache_enabled = $this->experiments->is_experiment_enabled( 'videoCache' ) && (bool) get_option( Settings::SETTING_NAME_VIDEO_CACHE );

		$story = new Story();
		$story->load_from_post( $post );

		$sanitizers[ Story_Sanitizer::class ] = [
			'publisher_logo'             => $this->get_publisher_logo(),
			'publisher'                  => $this->get_publisher_name(),
			'publisher_logo_placeholder' => $this->get_publisher_logo_placeholder(),
			'poster_images'              => [
				'poster-portrait-src' => $story->get_poster_portrait(),
			],
			'video_cache'                => $video_cache_enabled,
		];

		return $sanitizers;
	}
}
