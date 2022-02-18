<?php
/**
 * Class Meta_Sanitizer.
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

namespace Google\Web_Stories\AMP;

use Google\Web_Stories_Dependencies\AMP_Meta_Sanitizer;
use Google\Web_Stories_Dependencies\AmpProject\Html\Attribute;
use Google\Web_Stories_Dependencies\AmpProject\Html\Tag;

/**
 * Meta sanitizer.
 *
 * Sanitizes meta tags found in the header.
 *
 * This version avoids using amp_get_boilerplate_stylesheets().
 *
 * @since 1.1.0
 *
 * @see amp_get_boilerplate_stylesheets()
 * @see AMP_Meta_Sanitizer
 */
class Meta_Sanitizer extends AMP_Meta_Sanitizer {
	/**
	 * Always ensure we have a style[amp-boilerplate] and a noscript>style[amp-boilerplate].
	 *
	 * The AMP boilerplate styles should appear at the end of the head:
	 * "Finally, specify the AMP boilerplate code. By putting the boilerplate code last, it prevents custom styles from
	 * accidentally overriding the boilerplate css rules."
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @since 1.1.0
	 *
	 * @link https://amp.dev/documentation/guides-and-tutorials/learn/spec/amp-boilerplate/?format=websites
	 * @link https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/optimize_amp/#optimize-the-amp-runtime-loading
	 */
	protected function ensure_boilerplate_is_present(): void {
		$style  = null;
		$styles = $this->dom->xpath->query( './style[ @amp-boilerplate ]', $this->dom->head );

		if ( $styles ) {
			$style = $styles->item( 0 );
		}

		if ( ! $style ) {
			$style = $this->dom->createElement( Tag::STYLE );
			if ( $style ) {
				$style->setAttribute( Attribute::AMP_BOILERPLATE, '' );
				$style->appendChild( $this->dom->createTextNode( $this->get_boilerplate_stylesheets()[0] ) );
			}
		} elseif ( $style->parentNode ) {
			$style->parentNode->removeChild( $style ); // So we can move it.
		}
		if ( $style ) {
			$this->dom->head->appendChild( $style );
		}

		$noscript  = null;
		$noscripts = $this->dom->xpath->query( './noscript[ style[ @amp-boilerplate ] ]', $this->dom->head );

		if ( $noscripts ) {
			$noscript = $noscripts->item( 0 );
		}

		if ( ! $noscript ) {
			$noscript = $this->dom->createElement( Tag::NOSCRIPT );
			$style    = $this->dom->createElement( Tag::STYLE );
			if ( $style && $noscript ) {
				$style->setAttribute( Attribute::AMP_BOILERPLATE, '' );
				$style->appendChild( $this->dom->createTextNode( $this->get_boilerplate_stylesheets()[1] ) );
				$noscript->appendChild( $style );
			}
		} elseif ( $noscript->parentNode ) {
			$noscript->parentNode->removeChild( $noscript ); // So we can move it.
		}

		if ( $noscript ) {
			$this->dom->head->appendChild( $noscript );
		}
	}

	/**
	 * Get AMP boilerplate stylesheets.
	 *
	 * Clone of amp_get_boilerplate_stylesheets().
	 *
	 * @since 1.1.0
	 *
	 * @link https://www.ampproject.org/docs/reference/spec#boilerplate
	 * @see amp_get_boilerplate_stylesheets()
	 *
	 * @return string[] Stylesheets, where first is contained in style[amp-boilerplate] and the second in noscript>style[amp-boilerplate].
	 */
	protected function get_boilerplate_stylesheets(): array {
		return [
			'body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}',
			'body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}',
		];
	}
}
