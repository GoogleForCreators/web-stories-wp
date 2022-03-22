<?php
/**
 * Class Output_Buffer
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

use Google\Web_Stories\Context;
use Google\Web_Stories\Infrastructure\Conditional;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Throwable;

/**
 * Output buffer class.
 *
 * Largely copied from AMP_Theme_Support.
 *
 * @since 1.10.0
 *
 * @see \AMP_Theme_Support
 */
class Output_Buffer extends Service_Base implements Conditional {

	/**
	 * Whether output buffering has started.
	 *
	 * @var bool
	 */
	protected $is_output_buffering = false;

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
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private $context;

	/**
	 * Output_Buffer constructor.
	 *
	 * @since 1.10.0
	 *
	 * @param Sanitization $sanitization Sanitization instance.
	 * @param Optimization $optimization Optimization instance.
	 * @param Context      $context Context instance.
	 */
	public function __construct( Sanitization $sanitization, Optimization $optimization, Context $context ) {
		$this->sanitization = $sanitization;
		$this->optimization = $optimization;
		$this->context      = $context;
	}

	/**
	 * Runs on instantiation.
	 *
	 * @since 1.10.0
	 */
	public function register(): void {
		/*
		 * Start output buffering at very low priority for sake of plugins and themes that use template_redirect
		 * instead of template_include.
		 */
		$this->start_output_buffering();
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.10.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'template_redirect';
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.10.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int {
		// phpcs:ignore PHPCompatibility.Constants.NewConstants.php_int_minFound
		return \defined( 'PHP_INT_MIN' ) ? PHP_INT_MIN : ~PHP_INT_MAX;
	}

	/**
	 * Check whether the conditional object is currently needed.
	 *
	 * If the AMP plugin is installed and available in a version >= than ours,
	 * all sanitization and optimization should be delegated to the AMP plugin.
	 * But ONLY if AMP logic has not been disabled through any of its available filters.
	 *
	 * @since 1.10.0
	 *
	 * @return bool Whether the conditional object is needed.
	 */
	public static function is_needed(): bool {
		$current_post = get_post();

		$has_old_amp_version = ! \defined( '\AMP__VERSION' ) || ( \defined( '\AMP__VERSION' ) && version_compare( \AMP__VERSION, WEBSTORIES_AMP_VERSION, '<' ) );
		$amp_available       = function_exists( 'amp_is_available' ) && amp_is_available();
		$amp_enabled         = function_exists( 'amp_is_enabled' ) && amp_is_enabled(); // Technically an internal method.
		$amp_initialized     = did_action( 'amp_init' ) > 0;
		$amp_supported_post  = function_exists( 'amp_is_post_supported' ) && amp_is_post_supported( $current_post->ID ?? 0 );

		return $has_old_amp_version || ! $amp_available || ! $amp_enabled || ! $amp_initialized || ! $amp_supported_post;
	}

	/**
	 * Start output buffering.
	 *
	 * @since 1.10.0
	 *
	 * @see Sanitization::finish_output_buffering()
	 */
	public function start_output_buffering(): void {
		if ( ! $this->context->is_web_story() ) {
			return;
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
		} catch ( \Exception $exception ) {
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
			return $this->render_error_page( \Google\Web_Stories\Exception\SanitizationException::from_document_parse_error() );
		}

		$this->sanitization->sanitize_document( $dom );
		$this->optimization->optimize_document( $dom );

		return $dom->saveHTML();
	}

	/**
	 * Render error page.
	 *
	 * @since 1.10.0
	 *
	 * @param Throwable $throwable Exception or (as of PHP7) Error.
	 * @return string Error page.
	 *
	 * @todo Improve error message.
	 */
	private function render_error_page( Throwable $throwable ): string {
		return esc_html__( 'There was an error generating the web story, probably because of a server misconfiguration. Try contacting your hosting provider or open a new support request.', 'web-stories' );
	}
}
