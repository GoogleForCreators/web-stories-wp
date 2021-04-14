<?php
/**
 * Class Optimization
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

namespace Google\Web_Stories\AMP;

use Google\Web_Stories_Dependencies\AmpProject\AmpWP\RemoteRequest\CachedRemoteGetRequest;
use Google\Web_Stories_Dependencies\AmpProject\AmpWP\RemoteRequest\WpHttpRemoteGetRequest;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Configuration;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\DefaultConfiguration;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Error;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\ErrorCollection;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\LocalFallback;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\TransformationEngine;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\AmpRuntimeCss;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\PreloadHeroImage;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\RewriteAmpUrls;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\ServerSideRendering;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\TransformedIdentifier;
use Google\Web_Stories_Dependencies\AmpProject\RemoteRequest\FallbackRemoteGetRequest;
use Google\Web_Stories_Dependencies\AmpProject\RemoteRequest\FilesystemRemoteGetRequest;

/**
 * Optimization class.
 *
 * @since 1.1.0
 */
class Optimization {
	/**
	 * Optimizes a document.
	 *
	 * @since 1.1.0
	 *
	 * @param Document $document Document instance.
	 *
	 * @return void
	 */
	public function optimize_document( Document $document ) {
		$errors = new ErrorCollection();
		$this->get_optimizer()->optimizeDom( $document, $errors );

		if ( count( $errors ) > 0 ) {
			$error_messages = array_filter(
				array_map(
					static function( Error $error ) {
						// Hidden because amp-story is a render-delaying extension.
						if ( 'CannotRemoveBoilerplate' === $error->getCode() ) {
							return '';
						}

						return ' - ' . $error->getCode() . ': ' . $error->getMessage();
					},
					iterator_to_array( $errors )
				)
			);

			if ( ! empty( $error_messages ) ) {
				$document->head->appendChild(
					$document->createComment( "\n" . __( 'AMP optimization could not be completed due to the following:', 'web-stories' ) . "\n" . implode( "\n", $error_messages ) . "\n" )
				);
			}
		}
	}

	/**
	 * Optimizer instance to use.
	 *
	 * @since 1.1.0
	 *
	 * @see AMP_Theme_Support::get_optimizer
	 * @link https://github.com/ampproject/amp-wp/blob/8856284d90fc8558c30acc029becd352ae26e4e1/includes/class-amp-theme-support.php#L2235-L2255
	 *
	 * @return TransformationEngine Optimizer transformation engine to use.
	 */
	private function get_optimizer() {
		$configuration = self::get_optimizer_configuration();

		$fallback_remote_request_pipeline = new FallbackRemoteGetRequest(
			new WpHttpRemoteGetRequest(),
			new FilesystemRemoteGetRequest( LocalFallback::getMappings() )
		);

		$cached_remote_request = new CachedRemoteGetRequest( $fallback_remote_request_pipeline, WEEK_IN_SECONDS );

		return new TransformationEngine(
			$configuration,
			$cached_remote_request
		);
	}

	/**
	 * Get the AmpProject\Optimizer configuration object to use.
	 *
	 * @since 1.1.0
	 *
	 * @see AMP_Theme_Support::get_optimizer_configuration()
	 * @link https://github.com/ampproject/amp-wp/blob/8856284d90fc8558c30acc029becd352ae26e4e1/includes/class-amp-theme-support.php#L2257-L2315
	 *
	 * @return Configuration Optimizer configuration to use.
	 */
	private static function get_optimizer_configuration() {
		$transformers = Configuration::DEFAULT_TRANSFORMERS;

		/**
		 * Filter whether the AMP Optimizer should use server-side rendering or not.
		 *
		 * @since 1.1.0
		 *
		 * @param bool $enable_ssr Whether the AMP Optimizer should use server-side rendering or not.
		 */
		$enable_ssr = apply_filters( 'web_stories_enable_ssr', true );

		// In debugging mode, we don't use server-side rendering, as it further obfuscates the HTML markup.
		if ( ! $enable_ssr ) {
			$transformers = array_diff(
				$transformers,
				[
					AmpRuntimeCss::class,
					PreloadHeroImage::class,
					RewriteAmpUrls::class,
					ServerSideRendering::class,
					TransformedIdentifier::class,
				]
			);
		}

		$configuration = [
			Configuration::KEY_TRANSFORMERS => $transformers,
		];

		/**
		 * Filter the configuration to be used for the AMP Optimizer.
		 *
		 * @since 1.1.0
		 *
		 * @param array $configuration Associative array of configuration data.
		 */
		$configuration = apply_filters( 'web_stories_amp_optimizer_config', $configuration );

		return new DefaultConfiguration( $configuration );
	}
}
