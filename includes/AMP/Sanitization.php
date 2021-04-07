<?php
/**
 * Class Sanitization
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

use Google\Web_Stories_Dependencies\AMP_Allowed_Tags_Generated;
use Google\Web_Stories_Dependencies\AMP_Content_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_DOM_Utils;
use Google\Web_Stories_Dependencies\AMP_Layout_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_Script_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_Style_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_Tag_And_Attribute_Sanitizer;
use Google\Web_Stories_Dependencies\AmpProject\Amp;
use Google\Web_Stories_Dependencies\AmpProject\Attribute;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Google\Web_Stories_Dependencies\AmpProject\Extension;
use Google\Web_Stories_Dependencies\AmpProject\Tag;
use DOMElement;

/**
 * Sanitization class.
 *
 * Largely copied from AMP_Theme_Support.
 *
 * @since 1.1.0
 *
 * @see \AMP_Theme_Support
 */
class Sanitization {
	/**
	 * Sanitizes a document.
	 *
	 * @since 1.1.0
	 *
	 * @param Document $document Document instance.
	 *
	 * @return void
	 */
	public function sanitize_document( Document $document ) {
		$sanitizers = $this->get_sanitizers();

		$result = AMP_Content_Sanitizer::sanitize_document( $document, $sanitizers, [] );

		$this->ensure_required_markup( $document, $result['scripts'] );
	}

	/**
	 * Adds missing scripts.
	 *
	 * @SuppressWarnings(PHPMD)
	 *
	 * @since 1.1.0
	 *
	 * @see \AMP_Theme_Support::ensure_required_markup
	 * @link https://github.com/ampproject/amp-wp/blob/8856284d90fc8558c30acc029becd352ae26e4e1/includes/class-amp-theme-support.php#L1543-L1770
	 *
	 * @param Document $document Document instance.
	 * @param array    $scripts List of found scripts.
	 *
	 * @return void
	 */
	protected function ensure_required_markup( $document, $scripts ) {
		// Gather all links.
		$links = [
			Attribute::REL_PRECONNECT => [
				// Include preconnect link for AMP CDN for browsers that don't support preload.
				AMP_DOM_Utils::create_node(
					$document,
					Tag::LINK,
					[
						Attribute::REL  => Attribute::REL_PRECONNECT,
						Attribute::HREF => 'https://cdn.ampproject.org',
					]
				),
			],
		];

		// Obtain the existing AMP scripts.
		$amp_scripts     = [];
		$ordered_scripts = [];
		$head_scripts    = [];
		$runtime_src     = 'https://cdn.ampproject.org/v0.js';

		/**
		 * Script element.
		 *
		 * @var DOMElement $script
		 */
		foreach ( $document->head->getElementsByTagName( Tag::SCRIPT ) as $script ) {
			$head_scripts[] = $script;
		}

		foreach ( $head_scripts as $script ) {
			$src = $script->getAttribute( Attribute::SRC );

			if ( ! $src || 0 !== strpos( $src, 'https://cdn.ampproject.org/' ) ) {
				continue;
			}

			if ( 'v0.js' === substr( $src, - strlen( 'v0.js' ) ) ) {
				$amp_scripts[ Amp::RUNTIME ] = $script;
			} elseif ( $script->hasAttribute( Attribute::CUSTOM_ELEMENT ) ) {
				$amp_scripts[ $script->getAttribute( Attribute::CUSTOM_ELEMENT ) ] = $script;
			} elseif ( $script->hasAttribute( Attribute::CUSTOM_TEMPLATE ) ) {
				$amp_scripts[ $script->getAttribute( Attribute::CUSTOM_TEMPLATE ) ] = $script;
			}

			// It will be added back further down.
			$document->head->removeChild( $script );
		}

		$specs = $this->get_extension_sources();

		// Create scripts for any components discovered from output buffering that are missing.
		foreach ( array_diff( array_keys( $scripts ), array_keys( $amp_scripts ) ) as $missing_script_handle ) {
			$attrs = [
				Attribute::SRC   => $specs[ $missing_script_handle ],
				Attribute::ASYNC => '',
			];
			if ( Extension::MUSTACHE === $missing_script_handle ) {
				$attrs[ Attribute::CUSTOM_TEMPLATE ] = (string) $missing_script_handle;
			} else {
				$attrs[ Attribute::CUSTOM_ELEMENT ] = (string) $missing_script_handle;
			}

			$amp_scripts[ $missing_script_handle ] = AMP_DOM_Utils::create_node( $document, Tag::SCRIPT, $attrs );
		}

		// Remove scripts that had already been added but couldn't be detected from output buffering.
		$extension_specs            = AMP_Allowed_Tags_Generated::get_extension_specs();
		$superfluous_script_handles = array_diff(
			array_keys( $amp_scripts ),
			array_merge( array_keys( $scripts ), [ Amp::RUNTIME ] )
		);

		foreach ( $superfluous_script_handles as $superfluous_script_handle ) {
			if ( ! empty( $extension_specs[ $superfluous_script_handle ]['requires_usage'] ) ) {
				unset( $amp_scripts[ $superfluous_script_handle ] );
			}
		}

		/* phpcs:ignore Squiz.PHP.CommentedOutCode.Found
		 *
		 * "2. Next, preload the AMP runtime v0.js <script> tag with <link as=script href=https://cdn.ampproject.org/v0.js rel=preload>.
		 * The AMP runtime should start downloading as soon as possible because the AMP boilerplate hides the document via body { visibility:hidden }
		 * until the AMP runtime has loaded. Preloading the AMP runtime tells the browser to download the script with a higher priority."
		 * {@link https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp/ Optimize the AMP Runtime loading}
		 */
		$prioritized_preloads = [];
		if ( ! isset( $links[ Attribute::REL_PRELOAD ] ) ) {
			$links[ Attribute::REL_PRELOAD ] = [];
		}

		$prioritized_preloads[] = AMP_DOM_Utils::create_node(
			$document,
			Tag::LINK,
			[
				Attribute::REL  => Attribute::REL_PRELOAD,
				'as'            => Tag::SCRIPT,
				Attribute::HREF => $runtime_src,
			]
		);

		/*
		 * "3. If your page includes render-delaying extensions (e.g., amp-experiment, amp-dynamic-css-classes, amp-story),
		 * preload those extensions as they're required by the AMP runtime for rendering the page."
		 */
		$amp_script_handles = array_keys( $amp_scripts );
		foreach ( array_intersect( Amp::RENDER_DELAYING_EXTENSIONS, $amp_script_handles ) as $script_handle ) {
			if ( ! in_array( $script_handle, Amp::RENDER_DELAYING_EXTENSIONS, true ) ) {
				continue;
			}

			/**
			 * AMP script element.
			 *
			 * @var DOMElement $script_element
			 */
			$script_element = $amp_scripts[ $script_handle ];

			$prioritized_preloads[] = AMP_DOM_Utils::create_node(
				$document,
				Tag::LINK,
				[
					Attribute::REL  => Attribute::REL_PRELOAD,
					'as'            => Tag::SCRIPT,
					Attribute::HREF => $script_element->getAttribute( Attribute::SRC ),
				]
			);
		}
		$links[ Attribute::REL_PRELOAD ] = array_merge( $prioritized_preloads, $links[ Attribute::REL_PRELOAD ] );

		// Store the last meta tag as the previous node to append to.
		$meta_tags     = $document->head->getElementsByTagName( Tag::META );
		$previous_node = $meta_tags->length > 0 ? $meta_tags->item( $meta_tags->length - 1 ) : $document->head->firstChild;

		/*
		 * "4. Use preconnect to speedup the connection to other origin where the full resource URL is not known ahead of time,
		 * for example, when using Google Fonts."
		 *
		 * Note that \AMP_Style_Sanitizer::process_link_element() will ensure preconnect links for Google Fonts are present.
		 */
		$link_relations = [ Attribute::REL_PRECONNECT, Attribute::REL_DNS_PREFETCH, Attribute::REL_PRELOAD, Attribute::REL_PRERENDER, Attribute::REL_PREFETCH ];
		foreach ( $link_relations as $rel ) {
			if ( ! isset( $links[ $rel ] ) ) {
				continue;
			}

			/**
			 * Link node.
			 *
			 * @var DOMElement $link
			 */
			foreach ( $links[ $rel ] as $link ) {
				if ( $link->parentNode ) {
					$link->parentNode->removeChild( $link ); // So we can move it.
				}
				if ( $previous_node && $previous_node->nextSibling ) {
					$document->head->insertBefore( $link, $previous_node->nextSibling );
					$previous_node = $link;
				}
			}
		}

		// "5. Load the AMP runtime."
		if ( isset( $amp_scripts[ Amp::RUNTIME ] ) ) {
			$ordered_scripts[ Amp::RUNTIME ] = $amp_scripts[ Amp::RUNTIME ];
			unset( $amp_scripts[ Amp::RUNTIME ] );
		} else {
			$script = $document->createElement( Tag::SCRIPT );
			if ( $script ) {
				$script->setAttribute( Attribute::ASYNC, '' );
				$script->setAttribute( Attribute::SRC, $runtime_src );
				$ordered_scripts[ Amp::RUNTIME ] = $script;
			}
		}

		/*
		 * "6. Specify the <script> tags for render-delaying extensions (e.g., amp-experiment amp-dynamic-css-classes and amp-story"
		 *
		 * {@link https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp/ AMP Hosting Guide}
		 */
		foreach ( Amp::RENDER_DELAYING_EXTENSIONS as $extension ) {
			if ( isset( $amp_scripts[ $extension ] ) ) {
				$ordered_scripts[ $extension ] = $amp_scripts[ $extension ];
				unset( $amp_scripts[ $extension ] );
			}
		}

		/*
		 * "7. Specify the <script> tags for remaining extensions (e.g., amp-bind ...). These extensions are not render-delaying
		 * and therefore should not be preloaded as they might take away important bandwidth for the initial render."
		 */
		ksort( $amp_scripts );
		$ordered_scripts = array_merge( $ordered_scripts, $amp_scripts );

		/**
		 * Script element.
		 *
		 * @var DOMElement $ordered_script
		 */
		foreach ( $ordered_scripts as $ordered_script ) {
			if ( $previous_node && $previous_node->nextSibling ) {
				$document->head->insertBefore( $ordered_script, $previous_node->nextSibling );
				$previous_node = $ordered_script;
			}
		}
	}

	/**
	 * Returns AMP extension URLs, keyed by extension name.
	 *
	 * @since 1.1.0
	 *
	 * @see amp_register_default_scripts
	 * @link https://github.com/ampproject/amp-wp/blob/d96052ed76a92f43b70e0a52cf8e952cf46301af/includes/amp-helper-functions.php#L1011-L1074
	 *
	 * @return array List of extensions and their URLs.
	 */
	protected function get_extension_sources() {
		$specs = [];
		// Register all AMP components as defined in the spec.
		foreach ( AMP_Allowed_Tags_Generated::get_extension_specs() as $extension_name => $extension_spec ) {
			$src = sprintf(
				'https://cdn.ampproject.org/v0/%s-%s.js',
				$extension_name,
				end( $extension_spec['version'] )
			);

			$specs[ $extension_name ] = $src;
		}

		if ( isset( $specs['amp-experiment'] ) ) {
			/*
			 * Version 1.0 of amp-experiment is still experimental and requires the user to enable it.
			 * @todo Revisit once amp-experiment is no longer experimental.
			 */
			$specs['amp-experiment'] = 'https://cdn.ampproject.org/v0/amp-experiment-0.1.js';
		}

		return $specs;
	}

	/**
	 * Determine whether AMP dev mode is enabled.
	 *
	 * When enabled, the <html> element will get the data-ampdevmode attribute and the plugin will add the same attribute
	 * to elements associated with the admin bar and other elements that are provided by the `amp_dev_mode_element_xpaths`
	 * filter.
	 *
	 * @since 1.1.0
	 *
	 * @see amp_is_dev_mode
	 * @link https://github.com/ampproject/amp-wp/blob/d96052ed76a92f43b70e0a52cf8e952cf46301af/includes/amp-helper-functions.php#L1429-L1463
	 *
	 * @return bool Whether AMP dev mode is enabled.
	 */
	protected function is_amp_dev_mode() {
		// For the few sites that forcibly show the admin bar even when the user is logged out, only enable dev
		// mode if the user is actually logged in. This prevents the dev mode from being served to crawlers
		// when they index the AMP version.
		$dev_mode_enabled = ( is_admin_bar_showing() && is_user_logged_in() );

		/**
		 * Filters whether AMP dev mode is enabled.
		 *
		 * When enabled, the data-ampdevmode attribute will be added to the document element and it will allow the
		 * attributes to be added to the admin bar. It will also add the attribute to all elements which match the
		 * queries for the expressions returned by the 'web_stories_amp_dev_mode_element_xpaths' filter.
		 *
		 * @since 1.1.0
		 *
		 * @param bool Whether AMP dev mode is enabled.
		 */
		return apply_filters( 'web_stories_amp_dev_mode_enabled', $dev_mode_enabled );
	}

	/**
	 * Returns a list of sanitizers to use.
	 *
	 * This is replica of amp_get_content_sanitizers() to avoid
	 * loading amp-helper-functions.php due to side-effects like
	 * accessing options from the database, requiring AMP__VERSION,
	 * and causing conflicts with our own amp_is_request() compat shim.
	 *
	 * @since 1.1.0
	 *
	 * @see amp_get_content_sanitizers
	 * @see AMP_Validation_Manager::filter_sanitizer_args
	 * @link https://github.com/ampproject/amp-wp/blob/d96052ed76a92f43b70e0a52cf8e952cf46301af/includes/amp-helper-functions.php#L1465-L1653
	 * @link https://github.com/ampproject/amp-wp/blob/244a1a4e2c118ad70fe352beb5a34cd0d4b18705/includes/validation/class-amp-validation-manager.php#L2033-L2071
	 *
	 * @return array Sanitizers.
	 */
	protected function get_sanitizers() {
		$sanitizers = [
			AMP_Script_Sanitizer::class            => [],
			AMP_Style_Sanitizer::class             => [

				/*
				 * @todo Enable by default and allow filtering once AMP_Style_Sanitizer does not call AMP_Options_Manager
				 *       which in turn requires AMP__VERSION to be defined.
				 */
				'allow_transient_caching' => false,
				'use_document_element'    => true,
			],
			Meta_Sanitizer::class                  => [],
			AMP_Layout_Sanitizer::class            => [],
			Canonical_Sanitizer::class             => [],
			AMP_Tag_And_Attribute_Sanitizer::class => [],
		];

		/**
		 * Filters the content sanitizers.
		 *
		 * @since 1.1.0
		 *
		 * @param array  $sanitizers Sanitizers.
		 */
		$sanitizers = apply_filters( 'web_stories_amp_sanitizers', $sanitizers );

		if ( $this->is_amp_dev_mode() ) {
			/**
			 * Filters the XPath queries for elements that should be enabled for dev mode.
			 *
			 * By supplying XPath queries to this filter, the data-ampdevmode attribute will automatically be added to the
			 * root HTML element as well as to any elements that match the expressions. The attribute is added to the
			 * elements prior to running any of the sanitizers.
			 *
			 * @since 1.3
			 * @param string[] $element_xpaths XPath element queries. Context is the root element.
			 */
			$dev_mode_xpaths = (array) apply_filters( 'web_stories_amp_dev_mode_element_xpaths', [] );

			if ( is_admin_bar_showing() ) {
				$dev_mode_xpaths[] = '//*[ @id = "wpadminbar" ]';
				$dev_mode_xpaths[] = '//*[ @id = "wpadminbar" ]//*';
				$dev_mode_xpaths[] = '//style[ @id = "admin-bar-inline-css" ]';
			}

			$sanitizers = array_merge(
				[
					\AMP_Dev_Mode_Sanitizer::class => [
						'element_xpaths' => $dev_mode_xpaths,
					],
				],
				$sanitizers
			);
		}

		// Force certain sanitizers to be at end.
		// AMP_Style_Sanitizer needs to catch any CSS changes from previous sanitizers.
		// AMP_Tag_And_Attribute_Sanitizer must come at the end to clean up any remaining issues the other sanitizers didn't catch.
		foreach ( [
			AMP_Layout_Sanitizer::class,
			AMP_Style_Sanitizer::class,
			Meta_Sanitizer::class,
			AMP_Tag_And_Attribute_Sanitizer::class,
		] as $class_name ) {
			if ( isset( $sanitizers[ $class_name ] ) ) {
				$sanitizer = $sanitizers[ $class_name ];
				unset( $sanitizers[ $class_name ] );
				$sanitizers[ $class_name ] = $sanitizer;
			}
		}

		foreach ( $sanitizers as &$sanitizer ) {
			$sanitizer['validation_error_callback'] = [ $this, 'validation_error_callback' ];
		}

		unset( $sanitizer );

		return $sanitizers;
	}

	/**
	 * Validation error callback.
	 *
	 * @since 1.1.0
	 *
	 * @see AMP_Validation_Error_Taxonomy::get_validation_error_sanitization
	 *
	 * @param array $error Error info, especially code.
	 * @param array $data Additional data, including the node.
	 *
	 * @return bool Whether the validation error should be sanitized.
	 */
	public function validation_error_callback( array $error, array $data = [] ) {
		/**
		 * Filters whether the validation error should be sanitized.
		 *
		 * Returning true this indicates that the validation error is acceptable
		 * and should not be considered a blocker to render AMP. Returning null
		 * means that the default status should be used.
		 *
		 * Note that the $node is not passed here to ensure that the filter can be
		 * applied on validation errors that have been stored. Likewise, the $sources
		 * are also omitted because these are only available during an explicit
		 * validation request and so they are not suitable for plugins to vary
		 * sanitization by.
		 *
		 * @since 1.1.0
		 * @see AMP_Validation_Manager::is_sanitization_auto_accepted() Which controls whether an error is initially accepted or rejected for sanitization.
		 *
		 * @param null|bool $sanitized Whether sanitized; this is initially null, and changing it to bool causes the validation error to be forced.
		 * @param array $error Validation error being sanitized.
		 */
		return apply_filters( 'web_stories_amp_validation_error_sanitized', true, $error );
	}
}
