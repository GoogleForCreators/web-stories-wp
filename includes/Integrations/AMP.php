<?php
/**
 * Class AMP
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

namespace Google\Web_Stories\Integrations;

use DOMElement;
use Google\Web_Stories\AMP\Integration\AMP_Story_Sanitizer;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Publisher;
use WP_Post;
use WP_Screen;

/**
 * Class AMP.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 */
class AMP {
	use Publisher;

	/**
	 * Slug of the AMP validated URL post type.
	 *
	 * @var string
	 */
	const AMP_VALIDATED_URL_POST_TYPE = 'amp_validated_url';

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'option_amp-options', [ $this, 'filter_amp_options' ] );
		add_filter( 'amp_supportable_post_types', [ $this, 'filter_supportable_post_types' ] );
		add_filter( 'amp_to_amp_linking_element_excluded', [ $this, 'filter_amp_to_amp_linking_element_excluded' ], 10, 4 );
		add_filter( 'amp_content_sanitizers', [ $this, 'add_amp_content_sanitizers' ] );
		add_filter( 'amp_validation_error_sanitized', [ $this, 'filter_amp_validation_error_sanitized' ], 10, 2 );

		// This filter is actually used in this plugin's `Sanitization` class.
		add_filter( 'web_stories_amp_validation_error_sanitized', [ $this, 'filter_amp_validation_error_sanitized' ], 10, 2 );
	}

	/**
	 * Filter AMP options to force Standard mode (AMP-first) when a web story is being requested.
	 *
	 * @since 1.2.0
	 *
	 * @param array $options Options.
	 *
	 * @return array Filtered options.
	 */
	public function filter_amp_options( $options ) {
		if ( $this->get_request_post_type() === Story_Post_Type::POST_TYPE_SLUG ) {
			$options['theme_support']          = 'standard';
			$options['supported_post_types'][] = Story_Post_Type::POST_TYPE_SLUG;
			$options['supported_templates'][]  = 'is_singular';
		}
		return $options;
	}

	/**
	 * Filter the post types which are supportable.
	 *
	 * Remove web-stories from the list unless the currently requested post type is for a web-story. This is done in
	 * order to hide stories from the list of supportable post types on the AMP Settings screen.
	 *
	 * @since 1.2.0
	 *
	 * @param string[] $post_types Post types.
	 *
	 * @return array Supportable post types.
	 */
	public function filter_supportable_post_types( $post_types ) {
		if ( $this->get_request_post_type() === Story_Post_Type::POST_TYPE_SLUG ) {
			$post_types = array_merge( $post_types, [ Story_Post_Type::POST_TYPE_SLUG ] );
		} else {
			$post_types = array_diff( $post_types, [ Story_Post_Type::POST_TYPE_SLUG ] );
		}

		return array_values( $post_types );
	}

	/**
	 * Filters the AMP plugin's sanitizers.
	 *
	 * @since 1.2.0
	 *
	 * @param array $sanitizers Sanitizers.
	 * @return array Sanitizers.
	 */
	public function add_amp_content_sanitizers( $sanitizers ) {
		if ( ! is_singular( 'web-story' ) ) {
			return $sanitizers;
		}

		$post = get_queried_object();
		if ( ! ( $post instanceof WP_Post ) ) {
			return $sanitizers;
		}

		$story = new Story();
		$story->load_from_post( $post );
		$sanitizers[ AMP_Story_Sanitizer::class ] = [
			'publisher_logo'             => $this->get_publisher_logo(),
			'publisher_logo_placeholder' => $this->get_publisher_logo_placeholder(),
			'poster_images'              => [
				'poster-portrait-src'  => $story->get_poster_portrait(),
				'poster-square-src'    => $story->get_poster_square(),
				'poster-landscape-src' => $story->get_poster_landscape(),
			],
		];

		return $sanitizers;
	}

	/**
	 * Filter amp_validation_error_sanitized to prevent invalid markup removal for Web Stories.
	 *
	 * Since the amp-story element requires the poster-portrait-src attribute to be valid, when this attribute is absent
	 * the AMP plugin will try to remove the amp-story element altogether. This is not the preferred resolution! So
	 * instead, this will force the invalid markup to be kept. When this is done, the AMP plugin in Standard mode
	 * (which Web Stories enforces while serving singular web-story posts) will remove the amp attribute from the html
	 * element so that the page will not be advertised as AMP. This prevents GSC from complaining about a validation
	 * issue which we already know about.
	 *
	 * The same is done for <amp-video> elements, for example when they have missing poster images.
	 *
	 * @since 1.1.1
	 * @link https://github.com/ampproject/amp-wp/blob/c6aed8f/includes/validation/class-amp-validation-manager.php#L1777-L1809
	 *
	 * @param null|bool $sanitized Whether sanitized. Null means sanitization is not overridden.
	 * @param array     $error Validation error being sanitized.
	 * @return null|bool Whether sanitized.
	 */
	public function filter_amp_validation_error_sanitized( $sanitized, $error ) {
		// Skip sanitization for missing publisher logos and poster portrait images.
		if (
			( isset( $error['node_type'], $error['node_name'], $error['parent_name'] ) ) &&
			(
				( XML_ELEMENT_NODE === $error['node_type'] && 'amp-story' === $error['node_name'] && 'body' === $error['parent_name'] ) ||
				( XML_ATTRIBUTE_NODE === $error['node_type'] && 'poster-portrait-src' === $error['node_name'] && 'amp-story' === $error['parent_name'] ) ||
				( XML_ATTRIBUTE_NODE === $error['node_type'] && 'publisher-logo-src' === $error['node_name'] && 'amp-story' === $error['parent_name'] )
			)
		) {
			return false;
		}

		// Skip sanitization for missing video posters.
		if ( isset( $error['node_name'] ) && 'amp-video' === $error['node_name'] ) {
			return false;
		}

		// Skip sanitization for amp-video > source with invalid src.
		if ( isset( $error['parent_name'] ) && 'source' === $error['parent_name'] ) {
			return false;
		}

		return $sanitized;
	}

	/**
	 * Filters whether AMP-to-AMP is excluded for an element.
	 *
	 * The element may be either a link (`a` or `area`) or a `form`.
	 *
	 * @since 1.2.0
	 *
	 * @param bool       $excluded Excluded. Default value is whether element already has a `noamphtml` link relation or the URL is among `excluded_urls`.
	 * @param string     $url      URL considered for exclusion.
	 * @param string[]   $rel      Link relations.
	 * @param DOMElement $element  The element considered for excluding from AMP-to-AMP linking. May be instance of `a`, `area`, or `form`.
	 * @return bool Whether AMP-to-AMP is excluded.
	 */
	public function filter_amp_to_amp_linking_element_excluded( $excluded, $url, $rel, $element ) {
		if ( $element instanceof DOMElement && $element->parentNode instanceof DOMElement && 'amp-story-player' === $element->parentNode->tagName ) {
			return true;
		}

		return $excluded;
	}

	/**
	 * Get the post type for the current request.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @since 1.2.0
	 *
	 * @return string|null
	 */
	protected function get_request_post_type() {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if ( did_action( 'wp' ) && is_singular() ) {
			$post_type = get_post_type( get_queried_object_id() );
			return $post_type ?: null;
		}

		if (
			is_admin()
			&&
			isset( $_GET['action'], $_GET['post'] )
			&&
			'amp_validate' === $_GET['action']
			&&
			get_post_type( (int) $_GET['post'] ) === self::AMP_VALIDATED_URL_POST_TYPE
		) {
			return $this->get_validated_url_post_type( (int) $_GET['post'] );
		}

		$current_screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;

		if ( $current_screen instanceof WP_Screen ) {
			$current_post = get_post();

			if ( self::AMP_VALIDATED_URL_POST_TYPE === $current_screen->post_type && $current_post instanceof WP_Post && $current_post->post_type === $current_screen->post_type ) {
				$validated_url_post_type = $this->get_validated_url_post_type( $current_post->ID );
				if ( $validated_url_post_type ) {
					return $validated_url_post_type;
				}
			}

			if ( $current_screen->post_type ) {
				return $current_screen->post_type;
			}

			return null;
		}

		if ( isset( $_SERVER['REQUEST_URI'] ) && false !== strpos( (string) wp_unslash( $_SERVER['REQUEST_URI'] ), '/web-stories/v1/web-story/' ) ) {
			return Story_Post_Type::POST_TYPE_SLUG;
		}

		// phpcs:enable WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		return null;
	}

	/**
	 * Get the singular post type which is the queried object for the given validated URL post.
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id Post ID for Validated URL Post.
	 *
	 * @return string|null Post type or null if validated URL is not for a singular post.
	 */
	protected function get_validated_url_post_type( $post_id ) {
		if ( empty( $post_id ) ) {
			return null;
		}

		$post = get_post( $post_id );
		if ( ! ( $post instanceof WP_Post ) ) {
			return null;
		}

		if ( self::AMP_VALIDATED_URL_POST_TYPE !== $post->post_type ) {
			return null;
		}

		$queried_object = get_post_meta( $post->ID, '_amp_queried_object', true );
		if ( isset( $queried_object['id'], $queried_object['type'] ) && 'post' === $queried_object['type'] ) {
			$post_type = get_post_type( $queried_object['id'] );
			if ( $post_type ) {
				return $post_type;
			}
		}
		return null;
	}
}
