<?php
/**
 * Class Media_Source_Taxonomy
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Traits\Screen;
use WP_Query;
use WP_Post;
use WP_REST_Request;

/**
 * Class Media_Source_Taxonomy
 *
 * @package Google\Web_Stories\Media
 */
class Media_Source_Taxonomy extends Service_Base {
	use Screen;

	/**
	 * Key for media post type.
	 *
	 * @var string
	 */
	const TAXONOMY_SLUG = 'web_story_media_source';

	/**
	 * Init.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	public function register() {
		$this->register_taxonomy();

		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ], 10, 2 );

		// Hide video posters from Media grid view.
		add_filter( 'ajax_query_attachments_args', [ $this, 'filter_ajax_query_attachments_args' ] );
		// Hide video posters from Media list view.
		add_filter( 'pre_get_posts', [ $this, 'filter_generated_media_attachments' ] );
		// Hide video posters from web-stories/v1/media REST API requests.
		add_filter( 'web_stories_rest_attachment_query', [ $this, 'filter_rest_generated_media_attachments' ] );
	}

	/**
	 * Register taxonomy for attachment post type.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	protected function register_taxonomy() {
		register_taxonomy(
			self::TAXONOMY_SLUG,
			'attachment',
			[
				'label'        => __( 'Source', 'web-stories' ),
				'public'       => false,
				'rewrite'      => false,
				'hierarchical' => false,
				'show_in_rest' => true,
			]
		);
	}

	/**
	 * Registers additional REST API fields upon API initialization.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	public function rest_api_init() {
		// Custom field, as built in term update require term id and not slug.
		register_rest_field(
			'attachment',
			'media_source',
			[

				'get_callback'    => [ $this, 'get_callback_media_source' ],
				'schema'          => [
					'description' => __( 'Media source. ', 'web-stories' ),
					'type'        => 'string',
					'enum'        => [
						'editor',
						'poster-generation',
						'video-optimization',
						'source-video',
						'source-image',
						'gif-conversion',
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
	 * @param array   $response   Array of prepared attachment data.
	 * @param WP_Post $attachment Attachment object.
	 *
	 * @return array $response;
	 */
	public function wp_prepare_attachment_for_js( $response, $attachment ) {
		if ( ! is_array( $response ) ) {
			return $response;
		}
		$response['media_source'] = $this->get_callback_media_source( $response );

		return $response;
	}

	/**
	 * Force media attachment as string instead of the default array.
	 *
	 * @since 1.0.0
	 *
	 * @param array $prepared Prepared data before response.
	 *
	 * @return string
	 */
	public function get_callback_media_source( $prepared ) {
		$id = $prepared['id'];

		$terms = get_the_terms( $id, self::TAXONOMY_SLUG );
		if ( is_array( $terms ) && ! empty( $terms ) ) {
			$term = array_shift( $terms );

			return $term->slug;
		}

		return '';
	}

	/**
	 * Update rest field callback.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed   $value Value to update.
	 * @param WP_Post $object Object to update on.
	 *
	 * @return true|\WP_Error
	 */
	public function update_callback_media_source( $value, $object ) {
		$check = wp_set_object_terms( $object->ID, $value, self::TAXONOMY_SLUG );
		if ( is_wp_error( $check ) ) {
			return $check;
		}

		return true;
	}

	/**
	 * Returns the tax query needed to exclude generated video poster images and source videos.
	 *
	 * @param array $args Existing WP_Query args.
	 *
	 * @return array  Tax query arg.
	 */
	private function get_exclude_tax_query( array $args ): array {
		$tax_query = [
			[
				'taxonomy' => self::TAXONOMY_SLUG,
				'field'    => 'slug',
				'terms'    => [ 'poster-generation', 'source-video', 'source-image' ],
				'operator' => 'NOT IN',
			],
		];

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
		if ( ! empty( $args['tax_query'] ) ) {
			$tax_query[] = $args['tax_query'];
		}

		return $tax_query;
	}

	/**
	 * Filters the attachment query args to hide generated video poster images.
	 *
	 * Reduces unnecessary noise in the Media grid view.
	 *
	 * @since 1.10.0
	 *
	 * @param array $args Query args.
	 *
	 * @return array Filtered query args.
	 */
	public function filter_ajax_query_attachments_args( $args ) {
		if ( ! is_array( $args ) ) {
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
	 *
	 * @return void
	 */
	public function filter_generated_media_attachments( &$query ) {
		$current_screen = $this->get_current_screen();

		if ( ! $current_screen ) {
			return;
		}

		if ( is_admin() && $query->is_main_query() && 'upload' === $current_screen->id ) {
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
	 * @param array|mixed $args Query args.
	 *
	 * @return array|mixed Filtered query args.
	 */
	public function filter_rest_generated_media_attachments( $args ) {
		if ( ! is_array( $args ) ) {
			return $args;
		}
		$args['tax_query'] = $this->get_exclude_tax_query( $args ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query

		return $args;
	}
}
