<?php
/**
 * Class KSES.
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

namespace Google\Web_Stories;

use Google\Web_Stories\AMP\Meta_Sanitizer;
use Google\Web_Stories\AMP\Tag_And_Attribute_Sanitizer;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories_Dependencies\AMP_Content_Sanitizer;
use Google\Web_Stories_Dependencies\AMP_Script_Sanitizer;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;

/**
 * KSES class.
 *
 * Provides KSES utility methods to override the ones from core.
 *
 * @SuppressWarnings("PHPMD.ExcessiveClassComplexity")
 *
 * @phpstan-type PostData array{
 *   post_parent: int|string|null,
 *   post_type: string,
 *   post_content?: string,
 *   post_content_filtered?: string
 * }
 */
class KSES extends Service_Base implements HasRequirements {

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private Story_Post_Type $story_post_type;

	/**
	 * Page_Template_Post_Type instance.
	 *
	 * @var Page_Template_Post_Type Page_Template_Post_Type instance.
	 */
	private Page_Template_Post_Type $page_template_post_type;

	/**
	 * KSES constructor.
	 *
	 * @since 1.12.0
	 *
	 * @param Story_Post_Type         $story_post_type         Story_Post_Type instance.
	 * @param Page_Template_Post_Type $page_template_post_type Page_Template_Post_Type instance.
	 */
	public function __construct(
		Story_Post_Type $story_post_type,
		Page_Template_Post_Type $page_template_post_type
	) {
		$this->story_post_type         = $story_post_type;
		$this->page_template_post_type = $page_template_post_type;
	}

	/**
	 * Initializes KSES filters for stories.
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
		add_filter( 'wp_insert_post_data', [ $this, 'filter_insert_post_data' ], 10, 3 );
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because the story post type needs to be registered first.
	 *
	 * @since 1.13.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'story_post_type', 'page_template_post_type' ];
	}

	/**
	 * Filters slashed post data just before it is inserted into the database.
	 *
	 * Used to run story HTML markup through full AMP sanitization instead of just KSES.
	 *
	 * This allows storing full, valid AMP HTML documents in post_content for stories, which require
	 * more allowed HTML tags.
	 *
	 * @since 1.8.0
	 *
	 * @param mixed $data                An array of slashed, sanitized, and processed post data.
	 * @param mixed $postarr             An array of sanitized (and slashed) but otherwise unmodified post data.
	 * @param mixed $unsanitized_postarr An array of slashed yet *unsanitized* and unprocessed post data as
	 *                                   originally passed to wp_insert_post().
	 * @return array<string,mixed>|mixed Filtered post data.
	 *
	 * @phpstan-param PostData|mixed $data
	 * @phpstan-param PostData|mixed $unsanitized_postarr
	 *
	 * @template T
	 *
	 * @phpstan-return ($data is array<T> ? array<T> : mixed)
	 */
	public function filter_insert_post_data( $data, $postarr, $unsanitized_postarr ) {
		if ( current_user_can( 'unfiltered_html' ) ) {
			return $data;
		}

		if ( ! \is_array( $data ) || ! \is_array( $postarr ) || ! \is_array( $unsanitized_postarr ) ) {
			return $data;
		}

		if (
			! \is_string( $data['post_type'] ) ||
			! $this->is_allowed_post_type( $data['post_type'], $data['post_parent'] )
		) {
			return $data;
		}

		if (
			isset( $unsanitized_postarr['post_content_filtered'] ) &&
			\is_string( $unsanitized_postarr['post_content_filtered'] )
		) {
			$data['post_content_filtered'] = $this->filter_story_data( $unsanitized_postarr['post_content_filtered'] );
		}

		if ( isset( $unsanitized_postarr['post_content'] ) ) {
			$data['post_content'] = wp_slash( $this->sanitize_content( wp_unslash( $unsanitized_postarr['post_content'] ) ) );
		}

		return $data;
	}

	/**
	 * Sanitizes post content.
	 *
	 * @since 1.37.0
	 *
	 * @param string $content Unsanitized post content.
	 */
	private function sanitize_content( string $content ): string {
		$dom = Document::fromHtml( $content );
		if ( $dom instanceof Document ) {
			$sanitizers = $this->get_sanitizers();
			AMP_Content_Sanitizer::sanitize_document( $dom, $sanitizers, [] );
			return trim( $dom->saveHTML() );
		}

		return '';
	}

	/**
	 * Returns a list of sanitizers to use.
	 *
	 * This is replica of the Sanitization class implementation
	 * to have a minimal AMP sanitization for user-provided input.
	 *
	 * @since 1.37.0
	 *
	 * @see Sanitization
	 *
	 * @return array<string,array<string,bool|string[]|string>> Sanitizers.
	 */
	private function get_sanitizers(): array {
		$sanitizers = [
			AMP_Script_Sanitizer::class        => [
				'sanitize_js_scripts' => true,
			],
			Meta_Sanitizer::class              => [],
			Tag_And_Attribute_Sanitizer::class => [],
		];

		foreach ( $sanitizers as &$sanitizer ) {
			$sanitizer['validation_error_callback'] = static fn( array $error, array $data = [] ): bool => apply_filters( 'web_stories_amp_validation_error_sanitized', true, $error ); // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		}

		unset( $sanitizer );

		return $sanitizers;
	}

	/**
	 * Checks whether the post type is correct and user has capability to edit it.
	 *
	 * @since 1.22.0
	 *
	 * @param string          $post_type   Post type slug.
	 * @param int|string|null $post_parent Parent post ID.
	 * @return bool Whether the user can edit the provided post type.
	 */
	private function is_allowed_post_type( string $post_type, $post_parent ): bool {
		if ( $this->story_post_type->get_slug() === $post_type && $this->story_post_type->has_cap( 'edit_posts' ) ) {
			return true;
		}

		if ( $this->page_template_post_type->get_slug() === $post_type && $this->page_template_post_type->has_cap( 'edit_posts' ) ) {
			return true;
		}

		// For story autosaves.
		if (
			(
				'revision' === $post_type &&
				! empty( $post_parent ) &&
				get_post_type( (int) $post_parent ) === $this->story_post_type->get_slug()
			) &&
			$this->story_post_type->has_cap( 'edit_posts' )
		) {
			return true;
		}

		return false;
	}

	/**
	 * Filters story data.
	 *
	 * Provides simple sanity check to ensure story data is valid JSON.
	 *
	 * @since 1.22.0
	 *
	 * @param string $story_data JSON-encoded story data.
	 * @return string Sanitized & slashed story data.
	 */
	private function filter_story_data( string $story_data ): string {
		$decoded = json_decode( (string) wp_unslash( $story_data ), true );
		return null === $decoded ? '' : wp_slash( (string) wp_json_encode( $decoded ) );
	}
}
