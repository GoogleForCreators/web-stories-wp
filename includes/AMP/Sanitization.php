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

use AMP_Content_Sanitizer;
use AmpProject\Dom\Document;

/**
 * Sanitization class.
 */
class Sanitization {
	/**
	 * Sanitizes a document.
	 *
	 * @since 1.0.0
	 *
	 * @param Document $document Document instance.
	 *
	 * @return void
	 */
	public function sanitize_document( Document $document ) {
		$sanitizers = $this->get_sanitizers();
		foreach ( $sanitizers as $sanitizer_class => $args ) {
			if ( method_exists( $sanitizer_class, 'add_buffering_hooks' ) ) {
				call_user_func( [ $sanitizer_class, 'add_buffering_hooks' ], $args );
			}
		}

		// TODO: Do something with the result?
		AMP_Content_Sanitizer::sanitize_document( $document, $sanitizers, [] );
	}

	/**
	 * Determine whether AMP dev mode is enabled.
	 *
	 * When enabled, the <html> element will get the data-ampdevmode attribute and the plugin will add the same attribute
	 * to elements associated with the admin bar and other elements that are provided by the `amp_dev_mode_element_xpaths`
	 * filter.
	 *
	 * @since 1.0.0
	 *
	 * @return bool Whether AMP dev mode is enabled.
	 */
	protected function is_amp_dev_mode() {
		/**
		 * Filters whether AMP dev mode is enabled.
		 *
		 * When enabled, the data-ampdevmode attribute will be added to the document element and it will allow the
		 * attributes to be added to the admin bar. It will also add the attribute to all elements which match the
		 * queries for the expressions returned by the 'web_stories_amp_dev_mode_element_xpaths' filter.
		 *
		 * @since 1.0.0
		 *
		 * @param bool Whether AMP dev mode is enabled.
		 */
		return apply_filters(
			'web_stories_amp_dev_mode_enabled',
			(
				// For the few sites that forcibly show the admin bar even when the user is logged out, only enable dev
				// mode if the user is actually logged in. This prevents the dev mode from being served to crawlers
				// when they index the AMP version.
				( is_admin_bar_showing() && is_user_logged_in() )
			)
		);
	}

	/**
	 * Returns a list of sanitizers to use.
	 *
	 * This is replica of amp_get_content_sanitizers() to avoid
	 * loading amp-helper-functions.php due to side-effects like
	 * accessing options from the database, requiring AMP__VERSION,
	 * and causing conflicts with our own amp_is_request() compat shim.
	 *
	 * @since 1.0.0
	 */
	protected function get_sanitizers() {
		$sanitizers = [
			'AMP_Img_Sanitizer'               => [
				'add_noscript_fallback' => false,
			],
			'AMP_Video_Sanitizer'             => [
				'add_noscript_fallback' => false,
			],
			'AMP_Audio_Sanitizer'             => [
				'add_noscript_fallback' => false,
			],
			'AMP_Script_Sanitizer'            => [],
			'AMP_Style_Sanitizer'             => [],
			'AMP_Meta_Sanitizer'              => [],
			'AMP_Layout_Sanitizer'            => [],
			'AMP_Accessibility_Sanitizer'     => [],
			Canonical_Sanitizer::class        => [],
			'AMP_Tag_And_Attribute_Sanitizer' => [], // Note: This validating sanitizer must come at the end to clean up any remaining issues the other sanitizers didn't catch.
		];

		/**
		 * Filters the content sanitizers.
		 *
		 * @since 1.0.0
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
					'AMP_Dev_Mode_Sanitizer' => [
						'element_xpaths' => $dev_mode_xpaths,
					],
				],
				$sanitizers
			);
		}

		/*
		 * @todo Enable by default and allow filtering once AMP_Style_Sanitizer does not call AMP_Options_Manager
		 *       which in turn requires AMP__VERSION to be defined.
		 */
		$sanitizers['AMP_Style_Sanitizer']['allow_transient_caching'] = false;

		// Force style sanitizer, meta sanitizer, and validating sanitizer to be at end.
		foreach ( [ 'AMP_Style_Sanitizer', 'AMP_Meta_Sanitizer', 'AMP_Tag_And_Attribute_Sanitizer' ] as $class_name ) {
			if ( isset( $sanitizers[ $class_name ] ) ) {
				$sanitizer = $sanitizers[ $class_name ];
				unset( $sanitizers[ $class_name ] );
				$sanitizers[ $class_name ] = $sanitizer;
			}
		}

		return $sanitizers;
	}
}
