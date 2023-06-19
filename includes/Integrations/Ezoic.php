<?php
/**
 * Class Ezoic
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

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

declare(strict_types = 1);

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\AMP\Optimization;
use Google\Web_Stories\AMP\Sanitization;
use Google\Web_Stories\Context;
use Google\Web_Stories\Exception\SanitizationException;
use Google\Web_Stories\Infrastructure\Conditional;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Throwable;

/**
 * Class Ezoic.
 */
class Ezoic extends Service_Base implements Conditional {
	/**
	 * Sanitization instance.
	 *
	 * @var Sanitization Sanitization instance.
	 */
	private Sanitization $sanitization;

	/**
	 * Optimization instance.
	 *
	 * @var Optimization Optimization instance.
	 */
	private Optimization $optimization;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private Context $context;

	/**
	 * Constructor.
	 * 
	 * @since 1.33.0
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
	 * Initializes all hooks.
	 *
	 * @since 1.33.0
	 */
	public function register(): void {
		add_filter( 'ez_buffered_final_content', [ $this, 'process_ez_buffered_final_content' ] );
	}

	/**
	 * Check whether the Ezoic integration is currently needed.
	 *
	 * @since 1.33.0
	 *
	 * @return bool Whether Ezoic integration is currently needed.
	 */
	public static function is_needed(): bool {
		return \defined( 'EZOIC_INTEGRATION_VERSION' );
	}

	/**
	 * Optimizes and Sanitizes Ezoic's final prepared content.
	 *
	 * @since 1.33.0
	 *
	 * @param string $content HTML document response collected by Ezoic Output Buffer.
	 * @return string AMP document response.
	 */
	public function process_ez_buffered_final_content( string $content ): string {
		if ( $this->context->is_web_story() ) {
			// Enforce UTF-8 encoding as it is a requirement for AMP.
			if ( ! headers_sent() ) {
				header( 'Content-Type: text/html; charset=utf-8' );
			}

			$dom = Document::fromHtml( $content );

			if ( ! $dom instanceof Document ) {
				return $this->render_error_page( SanitizationException::from_document_parse_error() );
			}

			$this->sanitization->sanitize_document( $dom );
			$this->optimization->optimize_document( $dom );

			return $dom->saveHTML();
		}
		return $content;
	}

	/**
	 * Render error page.
	 *
	 * @since 1.33.0
	 *
	 * @param Throwable $throwable Exception or (as of PHP7) Error.
	 * @return string Error page.
	 */
	private function render_error_page( Throwable $throwable ): string {
		return esc_html__( 'There was an error generating the web story, probably because of a server misconfiguration. Try contacting your hosting provider or open a new support request.', 'web-stories' ) .
			"\n" .
			"\n" .
			// translators: 1: error message. 2: location.
			sprintf( esc_html__( 'Error message: %1$s (%2$s)', 'web-stories' ), $throwable->getMessage(), $throwable->getFile() . ':' . $throwable->getLine() );
	}
}
