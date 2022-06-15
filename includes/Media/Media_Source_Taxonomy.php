<?php
/**
 * Class Media_Source_Taxonomy
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

namespace Google\Web_Stories\Media;

use Google\Web_Stories\Context;
use Google\Web_Stories\REST_API\Stories_Terms_Controller;
use Google\Web_Stories\Taxonomy\Taxonomy_Base;
use WP_Post;
use WP_Query;

/**
 * Class Media_Source_Taxonomy
 *
 * @phpstan-import-type TaxonomyArgs from \Google\Web_Stories\Taxonomy\Taxonomy_Base
 */
class Media_Source_Taxonomy extends Taxonomy_Base {
	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private $context;

	/**
	 * Single constructor.
	 *
	 * @param Context $context Context instance.
	 */
	public function __construct( Context $context ) {
		$this->context = $context;
	}

	/**
	 * Taxonomy key.
	 *
	 * @var string
	 */
	protected $taxonomy_slug = 'web_story_media_source';

	/**
	 * Post type.
	 *
	 * @var string
	 */
	protected $taxonomy_post_type = 'attachment';

	/**
	 * Media Source key.
	 */
	public const MEDIA_SOURCE_KEY = 'web_stories_media_source';

	/**
	 * Init.
	 *
	 * @since 1.10.0
	 */
	public function register(): void {
		$this->register_taxonomy();

		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ] );

		// Hide video posters from Media grid view.
		add_filter( 'ajax_query_attachments_args', [ $this, 'filter_ajax_query_attachments_args' ] );
		// Hide video posters from Media list view.
		add_filter( 'pre_get_posts', [ $this, 'filter_generated_media_attachments' ] );
		// Hide video posters from web-stories/v1/media REST API requests.
		add_filter( 'web_stories_rest_attachment_query', [ $this, 'filter_rest_generated_media_attachments' ] );
	}

	/**
	 * Taxonomy args.
	 *
	 * @since 1.12.0
	 *
	 * @return array<string,mixed> Taxonomy args.
	 *
	 * @phpstan-return TaxonomyArgs
	 */
	protected function taxonomy_args(): array {
		return [
			'label'                 => __( 'Source', 'web-stories' ),
			'public'                => false,
			'rewrite'               => false,
			'hierarchical'          => false,
			'show_in_rest'          => true,
			'rest_namespace'        => self::REST_NAMESPACE,
			'rest_controller_class' => Stories_Terms_Controller::class,
		];
	}

	/**
	 * Registers additional REST API fields upon API initialization.
	 *
	 * @since 1.10.0
	 */
	public function rest_api_init(): void {
		// Custom field, as built in term update require term id and not slug.
		register_rest_field(
			$this->taxonomy_post_type,
			self::MEDIA_SOURCE_KEY,
			[

				'get_callback'    => [ $this, 'get_callback_media_source' ],
				'schema'          => [
					'description' => __( 'Media source.', 'web-stories' ),
					'type'        => 'string',
					'enum'        => [
						'editor',
						'poster-generation',
						'video-optimization',
						'source-video',
						'source-image',
						'gif-conversion',
						'page-template',
					],
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'update_callback' => [ $this, 'update_callback_media_source' ],
			]
		);
	}

	/**
	 * Filters the attachment data prepared for JavaScript.
	 *
	 * @since 1.0.0
	 *
	 * @param array|mixed $response   Array of prepared attachment data.
	 * @return array|mixed $response Filtered attachment data.
	 */
	public function wp_prepare_attachment_for_js( $response ) {
		if ( ! \is_array( $response ) ) {
			return $response;
		}
		$response[ self::MEDIA_SOURCE_KEY ] = $this->get_callback_media_source( $response );

		return $response;
	}

	/**
	 * Force media attachment as string instead of the default array.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string, mixed> $prepared Prepared data before response.
	 */
	public function get_callback_media_source( $prepared ): string {
		$id = $prepared['id'];

		$terms = get_the_terms( $id, $this->taxonomy_slug );
		if ( \is_array( $terms ) && ! empty( $terms ) ) {
			return array_shift( $terms )->slug;
		}

		return '';
	}

	/**
	 * Update rest field callback.
	 *
	 * @since 1.0.0
	 *
	 * @param string  $value  Value to update.
	 * @param WP_Post $object Object to update on.
	 * @return true|\WP_Error
	 */
	public function update_callback_media_source( $value, $object ) {
		$check = wp_set_object_terms( $object->ID, $value, $this->taxonomy_slug );
		if ( is_wp_error( $check ) ) {
			return $check;
		}

		return true;
	}

	/**
	 * Returns the tax query needed to exclude generated video poster images and source videos.
	 *
	 * @param array<string, mixed> $args Existing WP_Query args.
	 * @return array<string, mixed> Tax query arg.
	 */
	private function get_exclude_tax_query( array $args ): array {
		$tax_query = ! empty( $args['tax_query'] ) ? $args['tax_query'] : [];

		/**
		 * Filter whether generated attachments should be hidden in the media library.
		 *
		 * @since 1.16.0
		 *
		 * @param bool  $enabled Whether the taxonomy check should be applied.
		 * @param array $args    Existing WP_Query args.
		 */
		$enabled = apply_filters( 'web_stories_hide_auto_generated_attachments', true, $args );
		if ( true !== $enabled ) {
			return $tax_query;
		}

		/**
		 *  Merge with existing tax query if needed,
		 * in a nested way so WordPress will run them
		 * with an 'AND' relation. Example:
		 *
		 * [
		 *   'relation' => 'AND', // implicit.
		 *   [ this query ],
		 *   [ [ any ], [ existing ], [ tax queries] ]
		 * ]
		 */
		array_unshift(
			$tax_query,
			[
				[
					'taxonomy' => $this->taxonomy_slug,
					'field'    => 'slug',
					'terms'    => [ 'poster-generation', 'source-video', 'source-image', 'page-template' ],
					'operator' => 'NOT IN',
				],
			]
		);

		return $tax_query;
	}

	/**
	 * Filters the attachment query args to hide generated video poster images.
	 *
	 * Reduces unnecessary noise in the Media grid view.
	 *
	 * @since 1.10.0
	 *
	 * @param array<string, mixed>|mixed $args Query args.
	 * @return array<string, mixed>|mixed Filtered query args.
	 */
	public function filter_ajax_query_attachments_args( $args ) {
		if ( ! \is_array( $args ) ) {
			return $args;
		}
		$args['tax_query'] = $this->get_exclude_tax_query( $args ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query

		return $args;
	}

	/**
	 * Filters the current query to hide generated video poster images and source video.
	 *
	 * Reduces unnecessary noise in the Media list view.
	 *
	 * @since 1.10.0
	 *
	 * @param WP_Query $query WP_Query instance, passed by reference.
	 */
	public function filter_generated_media_attachments( &$query ): void {
		if ( is_admin() && $query->is_main_query() && $this->context->is_upload_screen() ) {
			$tax_query = $query->get( 'tax_query' );

			$query->set( 'tax_query', $this->get_exclude_tax_query( [ 'tax_query' => $tax_query ] ) ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		}
	}

	/**
	 * Filters the current query to hide generated video poster images.
	 *
	 * Reduces unnecessary noise in media REST API requests.
	 *
	 * @since 1.10.0
	 *
	 * @param array<string, mixed>|mixed $args Query args.
	 * @return array<string, mixed>|mixed Filtered query args.
	 */
	public function filter_rest_generated_media_attachments( $args ) {
		if ( ! \is_array( $args ) ) {
			return $args;
		}
		$args['tax_query'] = $this->get_exclude_tax_query( $args ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query

		return $args;
	}
}
