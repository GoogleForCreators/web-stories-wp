<?php
/**
 * Class KSES.
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

namespace Google\Web_Stories;

/**
 * KSES class.
 *
 * Provides KSES utility methods to override the ones from core.
 */
class KSES {
	/**
	 * Initializes KSES filters for stories.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function init() {
		if ( ! current_user_can( 'unfiltered_html' ) ) {
			add_filter( 'safe_style_css', [ $this, 'filter_safe_style_css' ] );
			add_filter( 'wp_kses_allowed_html', [ $this, 'filter_kses_allowed_html' ], 10, 2 );
			add_filter( 'content_save_pre', [ $this, 'filter_content_save_pre_before_kses' ], 0 );
			add_filter( 'content_save_pre', [ $this, 'filter_content_save_pre_after_kses' ], 20 );
			remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
		}
	}

	/**
	 * Restores original KSES behavior.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function remove_filters() {
		if ( ! current_user_can( 'unfiltered_html' ) ) {
			remove_filter( 'safe_style_css', [ $this, 'filter_safe_style_css' ] );
			remove_filter( 'wp_kses_allowed_html', [ $this, 'filter_kses_allowed_html' ], 10 );
			remove_filter( 'content_save_pre', [ $this, 'filter_content_save_pre_before_kses' ], 0 );
			remove_filter( 'content_save_pre', [ $this, 'filter_content_save_pre_after_kses' ], 20 );
		}
		kses_init();
	}

	/**
	 * Filters list of allowed CSS attributes.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $attr Array of allowed CSS attributes.
	 *
	 * @return array Filtered list of CSS attributes.
	 */
	public function filter_safe_style_css( $attr ) {
		$additional = [
			'display',
			'opacity',
			'position',
			'top',
			'left',
			'transform',
			'white-space',
			'clip-path',
			'-webkit-clip-path',
			'pointer-events',
		];

		array_push( $attr, ...$additional );

		return $attr;
	}

	/**
	 * Filters an inline style attribute and removes disallowed rules.
	 *
	 * This is equivalent to the WordPress core function of the same name,
	 * except that this does not remove CSS with parentheses in it.
	 *
	 * A few more allowed attributes are added via the safe_style_css filter.
	 *
	 * @see safecss_filter_attr()
	 * @todo Use safe_style_disallowed_chars filter once WP 5.5+ is required.
	 *
	 * @since 1.0.0
	 *
	 * @param string $css A string of CSS rules.
	 *
	 * @return string Filtered string of CSS rules.
	 */
	public function safecss_filter_attr( $css ) {
		$css = wp_kses_no_null( $css );
		$css = str_replace( [ "\n", "\r", "\t" ], '', $css );

		$allowed_protocols = wp_allowed_protocols();

		$css_array = explode( ';', trim( $css ) );

		/* This filter is documented in wp-includes/kses.php */
		$allowed_attr = apply_filters(
			'safe_style_css',
			[
				'background',
				'background-color',
				'background-image',
				'background-position',
				'background-size',
				'background-attachment',
				'background-blend-mode',

				'border',
				'border-radius',
				'border-width',
				'border-color',
				'border-style',
				'border-right',
				'border-right-color',
				'border-right-style',
				'border-right-width',
				'border-bottom',
				'border-bottom-color',
				'border-bottom-style',
				'border-bottom-width',
				'border-left',
				'border-left-color',
				'border-left-style',
				'border-left-width',
				'border-top',
				'border-top-color',
				'border-top-style',
				'border-top-width',

				'border-spacing',
				'border-collapse',
				'caption-side',

				'columns',
				'column-count',
				'column-fill',
				'column-gap',
				'column-rule',
				'column-span',
				'column-width',

				'color',
				'font',
				'font-family',
				'font-size',
				'font-style',
				'font-variant',
				'font-weight',
				'letter-spacing',
				'line-height',
				'text-align',
				'text-decoration',
				'text-indent',
				'text-transform',

				'height',
				'min-height',
				'max-height',

				'width',
				'min-width',
				'max-width',

				'margin',
				'margin-right',
				'margin-bottom',
				'margin-left',
				'margin-top',

				'padding',
				'padding-right',
				'padding-bottom',
				'padding-left',
				'padding-top',

				'flex',
				'flex-basis',
				'flex-direction',
				'flex-flow',
				'flex-grow',
				'flex-shrink',

				'grid-template-columns',
				'grid-auto-columns',
				'grid-column-start',
				'grid-column-end',
				'grid-column-gap',
				'grid-template-rows',
				'grid-auto-rows',
				'grid-row-start',
				'grid-row-end',
				'grid-row-gap',
				'grid-gap',

				'justify-content',
				'justify-items',
				'justify-self',
				'align-content',
				'align-items',
				'align-self',

				'clear',
				'cursor',
				'direction',
				'float',
				'overflow',
				'vertical-align',
				'list-style-type',
			]
		);

		/*
		 * CSS attributes that accept URL data types.
		 *
		 * This is in accordance to the CSS spec and unrelated to
		 * the sub-set of supported attributes above.
		 *
		 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/url
		 */
		$css_url_data_types = [
			'background',
			'background-image',

			'cursor',

			'list-style',
			'list-style-image',

			'clip-path',
			'-webkit-clip-path',
		];

		/*
		 * CSS attributes that accept gradient data types.
		 *
		 */
		$css_gradient_data_types = [
			'background',
			'background-image',
		];

		/*
		 * CSS attributes that accept color data types.
		 *
		 * This is in accordance to the CSS spec and unrelated to
		 * the sub-set of supported attributes above.
		 *
		 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
		 */
		$css_color_data_types = [
			'color',
			'background',
			'background-color',
			'border-color',
			'box-shadow',
			'outline',
			'outline-color',
			'text-shadow',
		];

		if ( empty( $allowed_attr ) ) {
			return $css;
		}

		$css = '';
		foreach ( $css_array as $css_item ) {
			if ( '' === $css_item ) {
				continue;
			}

			$css_item        = trim( $css_item );
			$css_test_string = $css_item;
			$found           = false;
			$url_attr        = false;
			$gradient_attr   = false;
			$color_attr      = false;
			$transform_attr  = false;

			$parts = explode( ':', $css_item, 2 );

			if ( false === strpos( $css_item, ':' ) ) {
				$found = true;
			} else {
				$css_selector = trim( $parts[0] );

				if ( in_array( $css_selector, $allowed_attr, true ) ) {
					$found          = true;
					$url_attr       = in_array( $css_selector, $css_url_data_types, true );
					$gradient_attr  = in_array( $css_selector, $css_gradient_data_types, true );
					$color_attr     = in_array( $css_selector, $css_color_data_types, true );
					$transform_attr = 'transform' === $css_selector;
				}
			}

			if ( $found && $url_attr ) {
				// Simplified: matches the sequence `url(*)`.
				preg_match_all( '/url\([^)]+\)/', $parts[1], $url_matches );

				foreach ( $url_matches[0] as $url_match ) {
					// Clean up the URL from each of the matches above.
					preg_match( '/^url\(\s*([\'\"]?)(.*)(\g1)\s*\)$/', $url_match, $url_pieces );

					if ( empty( $url_pieces[2] ) ) {
						$found = false;
						break;
					}

					$url = trim( $url_pieces[2] );

					if ( empty( $url ) || wp_kses_bad_protocol( $url, $allowed_protocols ) !== $url ) {
						$found = false;
						break;
					}

					// Remove the whole `url(*)` bit that was matched above from the CSS.
					$css_test_string = str_replace( $url_match, '', $css_test_string );
				}
			}

			if ( $found && $gradient_attr ) {
				$css_value = trim( $parts[1] );
				if ( preg_match( '/^(repeating-)?(linear|radial|conic)-gradient\(([^()]|rgb[a]?\([^()]*\))*\)$/', $css_value ) ) {
					// Remove the whole `gradient` bit that was matched above from the CSS.
					$css_test_string = str_replace( $css_value, '', $css_test_string );
				}
			}

			if ( $found && $color_attr ) {
				// Simplified: matches the sequence `rgb(*)` and `rgba(*)`.
				preg_match_all( '/rgba?\([^)]+\)/', $parts[1], $color_matches );

				foreach ( $color_matches[0] as $color_match ) {
					// Clean up the color from each of the matches above.
					preg_match( '/^rgba?\([^)]*\)$/', $color_match, $color_pieces );

					// Remove the whole `rgb(*)` / `rgba(*) bit that was matched above from the CSS.
					$css_test_string = str_replace( $color_match, '', $css_test_string );
				}
			}

			if ( $found && $transform_attr ) {
				$css_value = trim( $parts[1] );
				if ( preg_match( '/^((matrix|matrix3d|perspective|rotate|rotate3d|rotateX|rotateY|rotateZ|translate|translateX|translatY|translatZ|scale|scale3d|scalX|scaleY|scaleZ|skew|skewX|skeY)\(([^()])*\) ?)+$/', $css_value ) ) {
					// Remove the whole `gradient` bit that was matched above from the CSS.
					$css_test_string = str_replace( $css_value, '', $css_test_string );
				}
			}

			if ( $found ) {
				/* This filter is documented in wp-includes/kses.php */
				$disallowed_chars = apply_filters( 'safe_style_disallowed_chars', '%[\\\(&=}]|/\*%', $css_test_string );
				if ( ! preg_match( $disallowed_chars, $css_test_string ) ) {
					if ( '' !== $css ) {
						$css .= ';';
					}
					$css .= $css_item;
				}
			}
		}

		return $css;
	}


	/**
	 * Filter the allowed tags for KSES to allow for complete amp-story document markup.
	 *
	 * @since 1.0.0
	 *
	 * @param array|string $allowed_tags Allowed tags.
	 *
	 * @return array|string Allowed tags.
	 */
	public function filter_kses_allowed_html( $allowed_tags ) {
		if ( ! is_array( $allowed_tags ) ) {
			return $allowed_tags;
		}

		$story_components = [
			'html'                      => [
				'amp'  => true,
				'lang' => true,
			],
			'head'                      => [],
			'body'                      => [],
			'meta'                      => [
				'name'    => true,
				'content' => true,
				'charset' => true,
			],
			'script'                    => [
				'async'          => true,
				'src'            => true,
				'custom-element' => true,
			],
			'noscript'                  => [],
			'link'                      => [
				'href' => true,
				'rel'  => true,
			],
			'style'                     => [
				'type'            => true,
				'amp-boilerplate' => true,
				'amp-custom'      => true,
			],
			'amp-story'                 => [
				'background-audio'     => true,
				'live-story'           => true,
				'live-story-disabled'  => true,
				'poster-landscape-src' => true,
				'poster-portrait-src'  => true,
				'poster-square-src'    => true,
				'publisher'            => true,
				'publisher-logo-src'   => true,
				'standalone'           => true,
				'supports-landscape'   => true,
				'title'                => true,
			],
			'amp-story-page'            => [
				'auto-advance-after' => true,
				'background-audio'   => true,
				'id'                 => true,
			],
			'amp-story-page-attachment' => [
				'theme' => true,
			],
			'amp-story-grid-layer'      => [
				'aspect-ratio' => true,
				'position'     => true,
				'template'     => true,
			],
			'amp-story-cta-layer'       => [],
			'amp-story-animation'       => [
				'trigger' => true,
			],
			'amp-img'                   => [
				'alt'                       => true,
				'attribution'               => true,
				'data-amp-bind-alt'         => true,
				'data-amp-bind-attribution' => true,
				'data-amp-bind-src'         => true,
				'data-amp-bind-srcset'      => true,
				'lightbox'                  => true,
				'lightbox-thumbnail-id'     => true,
				'media'                     => true,
				'noloading'                 => true,
				'object-fit'                => true,
				'object-position'           => true,
				'placeholder'               => true,
				'src'                       => true,
				'srcset'                    => true,
			],
			'amp-video'                 => [
				'album'                      => true,
				'alt'                        => true,
				'artist'                     => true,
				'artwork'                    => true,
				'attribution'                => true,
				'autoplay'                   => true,
				'controls'                   => true,
				'controlslist'               => true,
				'crossorigin'                => true,
				'data-amp-bind-album'        => true,
				'data-amp-bind-alt'          => true,
				'data-amp-bind-artist'       => true,
				'data-amp-bind-artwork'      => true,
				'data-amp-bind-attribution'  => true,
				'data-amp-bind-controls'     => true,
				'data-amp-bind-controlslist' => true,
				'data-amp-bind-loop'         => true,
				'data-amp-bind-poster'       => true,
				'data-amp-bind-preload'      => true,
				'data-amp-bind-src'          => true,
				'data-amp-bind-title'        => true,
				'disableremoteplayback'      => true,
				'dock'                       => true,
				'lightbox'                   => true,
				'lightbox-thumbnail-id'      => true,
				'loop'                       => true,
				'media'                      => true,
				'muted'                      => true,
				'noaudio'                    => true,
				'noloading'                  => true,
				'object-fit'                 => true,
				'object-position'            => true,
				'placeholder'                => true,
				'poster'                     => true,
				'preload'                    => true,
				'rotate-to-fullscreen'       => true,
				'src'                        => true,
			],
			'source'                    => [
				'type' => true,
				'src'  => true,
			],
			'img'                       => [
				'alt'           => true,
				'attribution'   => true,
				'border'        => true,
				'decoding'      => true,
				'height'        => true,
				'importance'    => true,
				'intrinsicsize' => true,
				'ismap'         => true,
				'loading'       => true,
				'longdesc'      => true,
				'sizes'         => true,
				'src'           => true,
				'srcset'        => true,
				'srcwidth'      => true,
			],
			'svg'                       => [
				'width'  => true,
				'height' => true,
			],
			'defs'                      => [],
			'clippath'                  => [
				'transform'     => true,
				'clippathunits' => true,
				'path'          => true,
			],
			'path'                      => [
				'd' => true,
			],
		];

		$allowed_tags = array_merge( $allowed_tags, $story_components );

		$allowed_tags = array_map( [ $this, 'add_global_attributes' ], $allowed_tags );

		return $allowed_tags;
	}

	/**
	 * Helper function to add global attributes to a tag in the allowed HTML list.
	 *
	 * @since 1.0.0
	 *
	 * @see _wp_add_global_attributes
	 *
	 * @param array $value An array of attributes.
	 * @return array The array of attributes with global attributes added.
	 */
	protected function add_global_attributes( $value ) {
		$global_attributes = [
			'aria-describedby'    => true,
			'aria-details'        => true,
			'aria-label'          => true,
			'aria-labelledby'     => true,
			'aria-hidden'         => true,
			'class'               => true,
			'id'                  => true,
			'style'               => true,
			'title'               => true,
			'role'                => true,
			'data-*'              => true,
			'animate-in'          => true,
			'animate-in-duration' => true,
			'animate-in-delay'    => true,
			'animate-in-after'    => true,
			'animate-in-layout'   => true,
			'layout'              => true,
		];

		return array_merge( $value, $global_attributes );
	}

	/**
	 * Temporarily renames the style attribute to data-temp-style in full story markup.
	 *
	 * @since 1.0.0
	 *
	 * @param string $post_content Post content.
	 *
	 * @return string Filtered post content.
	 */
	public function filter_content_save_pre_before_kses( $post_content ) {
		return (string) preg_replace_callback(
			'|(?P<before><\w+(?:-\w+)*\s[^>]*?)style=\\\"(?P<styles>[^"]*)\\\"(?P<after>([^>]+?)*>)|', // Extra slashes appear here because $post_content is pre-slashed..
			static function ( $matches ) {
				return $matches['before'] . sprintf( ' data-temp-style="%s" ', $matches['styles'] ) . $matches['after'];
			},
			$post_content
		);
	}

	/**
	 * Renames data-temp-style back to style in full story markup.
	 *
	 * @since 1.0.0
	 *
	 * @param string $post_content Post content.
	 *
	 * @return string Filtered post content.
	 */
	public function filter_content_save_pre_after_kses( $post_content ) {
		return (string) preg_replace_callback(
			'/ data-temp-style=\\\"(?P<styles>[^"]*)\\\"/',
			function ( $matches ) {
				$styles = str_replace( '&quot;', '\"', $matches['styles'] );
				return sprintf( ' style="%s"', esc_attr( $this->safecss_filter_attr( wp_kses_stripslashes( $styles ) ) ) );
			},
			$post_content
		);
	}
}
