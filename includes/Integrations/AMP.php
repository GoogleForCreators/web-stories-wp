<?php
/**
 * Class AMP
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

namespace Google\Web_Stories\Integrations;

use DOMElement;
use Google\Web_Stories\AMP\Integration\AMP_Story_Sanitizer;
use Google\Web_Stories\Context;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;

/**
 * Class AMP.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 *
 * @phpstan-type AMPOptions array{
 *   theme_support?: string,
 *   supported_post_types?: string[],
 *   supported_templates?: string[]
 * }
 *
 * @phpstan-type AMPSanitizers array{
 *   AMP_Style_Sanitizer?: array{
 *     dynamic_element_selectors?: string[]
 *   }
 * }
 */
class AMP extends Service_Base implements HasRequirements {
	/**
	 * Slug of the AMP validated URL post type.
	 */
	public const AMP_VALIDATED_URL_POST_TYPE = 'amp_validated_url';

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private $settings;

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private $context;

	/**
	 * Analytics constructor.
	 *
	 * @since 1.12.0
	 *
	 * @param Settings        $settings        Settings instance.
	 * @param Story_Post_Type $story_post_type Experiments instance.
	 * @param Context         $context         Context instance.
	 * @return void
	 */
	public function __construct(
		Settings $settings,
		Story_Post_Type $story_post_type,
		Context $context
	) {
		$this->settings        = $settings;
		$this->story_post_type = $story_post_type;
		$this->context         = $context;
	}

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.2.0
	 */
	public function register(): void {
		add_filter( 'option_amp-options', [ $this, 'filter_amp_options' ] );
		add_filter( 'amp_supportable_post_types', [ $this, 'filter_supportable_post_types' ] );
		add_filter( 'amp_to_amp_linking_element_excluded', [ $this, 'filter_amp_to_amp_linking_element_excluded' ], 10, 4 );
		add_filter( 'amp_content_sanitizers', [ $this, 'add_amp_content_sanitizers' ] );
		add_filter( 'amp_validation_error_sanitized', [ $this, 'filter_amp_validation_error_sanitized' ], 10, 2 );
		add_filter( 'amp_skip_post', [ $this, 'filter_amp_skip_post' ], 10, 2 );

		// This filter is actually used in this plugin's `Sanitization` class.
		add_filter( 'web_stories_amp_validation_error_sanitized', [ $this, 'filter_amp_validation_error_sanitized' ], 10, 2 );
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because settings needs to be registered first.
	 *
	 * @since 1.13.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'settings' ];
	}

	/**
	 * Filter AMP options to force Standard mode (AMP-first) when a web story is being requested.
	 *
	 * @since 1.2.0
	 *
	 * @param array|mixed $options Options.
	 * @return array|mixed Filtered options.
	 *
	 * @phpstan-param AMPOptions $options
	 */
	public function filter_amp_options( $options ) {
		if ( ! \is_array( $options ) ) {
			return $options;
		}
		if ( $this->get_request_post_type() === $this->story_post_type->get_slug() ) {
			$options['theme_support']          = 'standard';
			$options['supported_post_types'][] = $this->story_post_type->get_slug();
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
	 * @param string[]|mixed $post_types Supportable post types.
	 * @return array|mixed Supportable post types.
	 */
	public function filter_supportable_post_types( $post_types ) {
		if ( ! \is_array( $post_types ) ) {
			return $post_types;
		}

		$story_post_type = $this->story_post_type->get_slug();

		$post_types = array_diff( $post_types, [ $story_post_type ] );

		if ( $this->get_request_post_type() === $story_post_type ) {
			$post_types = array_merge( $post_types, [ $story_post_type ] );
		}

		return array_unique( array_values( $post_types ) );
	}

	/**
	 * Filters the AMP plugin's sanitizers.
	 *
	 * @since 1.2.0
	 *
	 * @param array|mixed $sanitizers Sanitizers.
	 * @return array|mixed Sanitizers.
	 *
	 * @phpstan-param AMPSanitizers|mixed $sanitizers
	 * @phpstan-return AMPSanitizers|mixed
	 */
	public function add_amp_content_sanitizers( $sanitizers ) {
		if ( ! $this->context->is_web_story() ) {
			return $sanitizers;
		}

		$post = get_queried_object();
		if ( ! ( $post instanceof WP_Post ) ) {
			return $sanitizers;
		}

		if ( ! \is_array( $sanitizers ) ) {
			return $sanitizers;
		}

		/**
		 * AMP sanitizer configuration.
		 *
		 * @phpstan-var AMPSanitizers $sanitizers
		 */

		$video_cache_enabled = (bool) $this->settings->get_setting( $this->settings::SETTING_NAME_VIDEO_CACHE );

		$story = new Story();
		$story->load_from_post( $post );

		$poster_images = [
			'poster-portrait-src' => esc_url_raw( $story->get_poster_portrait() ),
		];

		if ( isset( $sanitizers['AMP_Style_Sanitizer'] ) ) {
			if ( ! isset( $sanitizers['AMP_Style_Sanitizer']['dynamic_element_selectors'] ) ) {
				$sanitizers['AMP_Style_Sanitizer']['dynamic_element_selectors'] = [];
			}

			$sanitizers['AMP_Style_Sanitizer']['dynamic_element_selectors'][] = 'amp-story-captions';
		}

		$sanitizers[ AMP_Story_Sanitizer::class ] = [
			'publisher_logo' => $story->get_publisher_logo_url(),
			'publisher'      => $story->get_publisher_name(),
			'poster_images'  => array_filter( $poster_images ),
			'video_cache'    => $video_cache_enabled,
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
	 *
	 * @link https://github.com/ampproject/amp-wp/blob/c6aed8f/includes/validation/class-amp-validation-manager.php#L1777-L1809
	 *
	 * @param null|bool                                                        $sanitized Whether sanitized. Null means sanitization is not overridden.
	 * @param array{node_type?: int, node_name?: string, parent_name?: string} $error     Validation error being sanitized.
	 * @return null|bool Whether sanitized.
	 */
	public function filter_amp_validation_error_sanitized( $sanitized, $error ): ?bool {
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
	 * @param bool|mixed $excluded Excluded. Default value is whether element already has a `noamphtml` link relation or the URL is among `excluded_urls`.
	 * @param string     $url      URL considered for exclusion.
	 * @param string[]   $rel      Link relations.
	 * @param DOMElement $element  The element considered for excluding from AMP-to-AMP linking. May be instance of `a`, `area`, or `form`.
	 * @return bool|mixed Whether AMP-to-AMP is excluded.
	 */
	public function filter_amp_to_amp_linking_element_excluded( $excluded, $url, $rel, $element ) {
		if ( $element instanceof DOMElement && $element->parentNode instanceof DOMElement && 'amp-story-player' === $element->parentNode->tagName ) {
			return true;
		}

		return $excluded;
	}

	/**
	 * Filters whether to skip the post from AMP.
	 *
	 * Skips the post if the AMP plugin's version is lower than what is bundled in this plugin.
	 * Prevents issues where this plugin uses newer features that the plugin doesn't know about yet,
	 * causing false positives with validation.
	 *
	 * @since 1.6.0
	 *
	 * @link https://github.com/googleforcreators/web-stories-wp/issues/7131
	 *
	 * @param bool|mixed $skipped Whether the post should be skipped from AMP.
	 * @param int        $post    Post ID.
	 * @return bool|mixed Whether post should be skipped from AMP.
	 */
	public function filter_amp_skip_post( $skipped, $post ) {
		// This is the opposite to the `AMP__VERSION >= WEBSTORIES_AMP_VERSION` check in the HTML renderer.
		if (
			$this->story_post_type->get_slug() === get_post_type( $post )
			&&
			\defined( '\AMP__VERSION' )
			&&
			version_compare( WEBSTORIES_AMP_VERSION, AMP__VERSION, '>' )
		) {
			return true;
		}

		return $skipped;
	}

	/**
	 * Get the post type for the current request.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @since 1.2.0
	 */
	protected function get_request_post_type(): ?string {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized

		if ( did_action( 'wp' ) && is_singular() ) {
			$post_type = get_post_type( get_queried_object_id() );
			return $post_type ?: null;
		}

		if (
			isset( $_GET['action'], $_GET['post'] ) &&
			'amp_validate' === $_GET['action'] &&
			is_admin()
		) {
			/**
			 * Post ID.
			 *
			 * @var string|int $post_id
			 */
			$post_id = $_GET['post'];

			if ( get_post_type( (int) $post_id ) === self::AMP_VALIDATED_URL_POST_TYPE ) {
				return $this->get_validated_url_post_type( (int) $post_id );
			}
		}

		$current_screen_post_type = $this->context->get_screen_post_type();

		if ( $current_screen_post_type ) {
			$current_post = get_post();

			if ( self::AMP_VALIDATED_URL_POST_TYPE === $current_screen_post_type && $current_post instanceof WP_Post && $current_post->post_type === $current_screen_post_type ) {
				$validated_url_post_type = $this->get_validated_url_post_type( $current_post->ID );
				if ( $validated_url_post_type ) {
					return $validated_url_post_type;
				}
			}

			return $current_screen_post_type;
		}

		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			/**
			 * Request URI.
			 *
			 * @var string $request_uri
			 */
			$request_uri = $_SERVER['REQUEST_URI'];
			if ( false !== strpos( (string) wp_unslash( $request_uri ), $this->story_post_type->get_rest_url() ) ) {
				return $this->story_post_type->get_slug();
			}
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
	 * @return string|null Post type or null if validated URL is not for a singular post.
	 */
	protected function get_validated_url_post_type( $post_id ): ?string {
		if ( empty( $post_id ) ) {
			return null;
		}

		$post = get_post( $post_id );
		if ( ! $post instanceof WP_Post ) {
			return null;
		}

		if ( self::AMP_VALIDATED_URL_POST_TYPE !== $post->post_type ) {
			return null;
		}

		/**
		 * AMP queried object.
		 *
		 * @var array{type?: string, id?: int|string}|string $queried_object
		 */
		$queried_object = get_post_meta( $post->ID, '_amp_queried_object', true );

		if ( ! \is_array( $queried_object ) ) {
			return null;
		}

		if ( isset( $queried_object['id'], $queried_object['type'] ) && 'post' === $queried_object['type'] ) {
			/**
			 * Post ID.
			 *
			 * @var int|string $post_id
			 */
			$post_id = $queried_object['id'];

			$post_type = get_post_type( (int) $post_id );
			if ( $post_type ) {
				return $post_type;
			}
		}

		return null;
	}
}
