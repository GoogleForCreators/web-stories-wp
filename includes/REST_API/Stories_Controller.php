<?php
/**
 * Class Stories_Controller
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

namespace Google\Web_Stories\REST_API;

use Google\Web_Stories\Demo_Content;
use Google\Web_Stories\Media;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Publisher;
use WP_Query;
use WP_Error;
use WP_Post;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Stories_Controller class.
 */
class Stories_Controller extends Stories_Base_Controller {
	use Publisher;
	/**
	 * Default style presets to pass if not set.
	 */
	const EMPTY_STYLE_PRESETS = [
		'colors'     => [],
		'textStyles' => [],
	];

	/**
	 * Prepares a single story output for response. Add post_content_filtered field to output.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Post         $post Post object.
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $post, $request ) {
		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$schema  = $this->get_item_schema();

		if ( wp_validate_boolean( $request['web_stories_demo'] ) && 'auto-draft' === $post->post_status ) {
			$demo         = new Demo_Content();
			$demo_content = $demo->get_content();
			if ( ! empty( $demo_content ) ) {
				$post->post_title            = $demo->get_title();
				$post->post_content_filtered = $demo_content;
			}
		}

		$response = parent::prepare_item_for_response( $post, $request );
		$fields   = $this->get_fields_for_response( $request );
		$data     = $response->get_data();

		if ( in_array( 'publisher_logo_url', $fields, true ) ) {
			$data['publisher_logo_url'] = $this->get_publisher_logo();
		}

		if ( in_array( 'style_presets', $fields, true ) ) {
			$style_presets         = get_option( Story_Post_Type::STYLE_PRESETS_OPTION, self::EMPTY_STYLE_PRESETS );
			$data['style_presets'] = is_array( $style_presets ) ? $style_presets : self::EMPTY_STYLE_PRESETS;
		}

		if ( in_array( 'featured_media_url', $fields, true ) ) {
			$image                      = get_the_post_thumbnail_url( $post, Media::POSTER_PORTRAIT_IMAGE_SIZE );
			$data['featured_media_url'] = ! empty( $image ) ? $image : $schema['properties']['featured_media_url']['default'];
		}

		if ( in_array( 'preview_link', $fields, true ) ) {
			// Based on https://github.com/WordPress/wordpress-develop/blob/8153c8ba020c4aec0b9d94243cd39c689a0730f7/src/wp-admin/includes/post.php#L1445-L1457.
			if ( 'draft' === $post->post_status || empty( $post->post_name ) ) {
				$view_link = get_preview_post_link( $post );
			} else {
				if ( 'publish' === $post->post_status ) {
					$view_link = get_permalink( $post );
				} else {
					if ( ! function_exists( 'get_sample_permalink' ) ) {
						require_once ABSPATH . 'wp-admin/includes/post.php';
					}

					list ( $permalink ) = get_sample_permalink( $post->ID, $post->post_title, '' );

					// Allow non-published (private, future) to be viewed at a pretty permalink, in case $post->post_name is set.
					$view_link = str_replace( [ '%pagename%', '%postname%' ], $post->post_name, $permalink );
				}
			}

			$data['preview_link'] = $view_link;
		}

		$data  = $this->filter_response_by_context( $data, $context );
		$links = $response->get_links();

		$response = new WP_REST_Response( $data );
		foreach ( $links as $rel => $rel_links ) {
			foreach ( $rel_links as $link ) {
				$response->add_link( $rel, $link['href'], $link['attributes'] );
			}
		}

		/**
		 * Filters the post data for a response.
		 *
		 * The dynamic portion of the hook name, `$this->post_type`, refers to the post type slug.
		 *
		 * @since 1.0.0
		 *
		 * @param WP_REST_Response $response The response object.
		 * @param WP_Post $post Post object.
		 * @param WP_REST_Request $request Request object.
		 */
		return apply_filters( "rest_prepare_{$this->post_type}", $response, $post, $request );
	}

	/**
	 * Updates a single post.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $request ) {
		$response = parent::update_item( $request );

		if ( is_wp_error( $response ) ) {
			return rest_ensure_response( $response );
		}

		// If publisher logo is set, let's assign that.
		$publisher_logo_id = $request->get_param( 'publisher_logo' );
		if ( $publisher_logo_id ) {
			$all_publisher_logos   = get_option( Settings::SETTING_NAME_PUBLISHER_LOGOS );
			$all_publisher_logos[] = $publisher_logo_id;

			update_option( Settings::SETTING_NAME_PUBLISHER_LOGOS, array_unique( $all_publisher_logos ) );
			update_option( Settings::SETTING_NAME_ACTIVE_PUBLISHER_LOGO, $publisher_logo_id );
		}

		// If style presets are set.
		$style_presets = $request->get_param( 'style_presets' );
		if ( is_array( $style_presets ) ) {
			update_option( Story_Post_Type::STYLE_PRESETS_OPTION, $style_presets );
		}

		return rest_ensure_response( $response );
	}

	/**
	 * Retrieves the story's schema, conforming to JSON Schema.
	 *
	 * @since 1.0.0
	 *
	 * @return array Item schema as an array.
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}

		$schema = parent::get_item_schema();

		$schema['properties']['publisher_logo_url'] = [
			'description' => __( 'Publisher logo URL.', 'web-stories' ),
			'type'        => 'string',
			'context'     => [ 'views', 'edit' ],
			'format'      => 'uri',
			'default'     => '',
		];

		$schema['properties']['style_presets'] = [
			'description' => __( 'Style presets used by all stories', 'web-stories' ),
			'type'        => 'object',
			'context'     => [ 'view', 'edit' ],
		];

		$schema['properties']['preview_link'] = [
			'description' => __( 'Preview Link.', 'web-stories' ),
			'type'        => 'string',
			'context'     => [ 'edit' ],
			'format'      => 'uri',
			'default'     => '',
		];

		$schema['properties']['featured_media_url'] = [
			'description' => __( 'URL for the story\'s poster image (portrait)', 'web-stories' ),
			'type'        => 'string',
			'format'      => 'uri',
			'context'     => [ 'view', 'edit', 'embed' ],
			'readonly'    => true,
			'default'     => '',
		];

		$schema['properties']['status']['enum'][] = 'auto-draft';

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Filters query clauses to sort posts by the author's display name.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $clauses Associative array of the clauses for the query.
	 * @param WP_Query $query   The WP_Query instance.
	 *
	 * @return array Filtered query clauses.
	 */
	public function filter_posts_clauses( $clauses, $query ) {
		global $wpdb;

		if ( $this->post_type !== $query->get( 'post_type' ) ) {
			return $clauses;
		}
		if ( 'story_author' !== $query->get( 'orderby' ) ) {
			return $clauses;
		}

		// phpcs:disable WordPressVIPMinimum.Variables.RestrictedVariables.user_meta__wpdb__users
		$order              = $query->get( 'order' );
		$clauses['join']   .= " LEFT JOIN {$wpdb->users} ON {$wpdb->posts}.post_author={$wpdb->users}.ID";
		$clauses['orderby'] = "{$wpdb->users}.display_name $order, " . $clauses['orderby'];
		// phpcs:enable WordPressVIPMinimum.Variables.RestrictedVariables.user_meta__wpdb__users

		return $clauses;
	}

	/**
	 * Retrieves a collection of web stories.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		add_filter( 'posts_clauses', [ $this, 'filter_posts_clauses' ], 10, 2 );
		$response = parent::get_items( $request );
		remove_filter( 'posts_clauses', [ $this, 'filter_posts_clauses' ], 10 );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		if ( 'edit' !== $request['context'] ) {
			return $response;
		}

		// Retrieve the list of registered collection query parameters.
		$registered = $this->get_collection_params();
		$args       = [];

		/*
		 * This array defines mappings between public API query parameters whose
		 * values are accepted as-passed, and their internal WP_Query parameter
		 * name equivalents (some are the same). Only values which are also
		 * present in $registered will be set.
		 */
		$parameter_mappings = [
			'author'         => 'author__in',
			'author_exclude' => 'author__not_in',
			'exclude'        => 'post__not_in', // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude
			'include'        => 'post__in',
			'menu_order'     => 'menu_order',
			'offset'         => 'offset',
			'order'          => 'order',
			'orderby'        => 'orderby',
			'page'           => 'paged',
			'parent'         => 'post_parent__in',
			'parent_exclude' => 'post_parent__not_in',
			'search'         => 's',
			'slug'           => 'post_name__in',
			'status'         => 'post_status',
		];

		/*
		 * For each known parameter which is both registered and present in the request,
		 * set the parameter's value on the query $args.
		 */
		foreach ( $parameter_mappings as $api_param => $wp_param ) {
			if ( isset( $registered[ $api_param ], $request[ $api_param ] ) ) {
				$args[ $wp_param ] = $request[ $api_param ];
			}
		}

		// Check for & assign any parameters which require special handling or setting.
		$args['date_query'] = [];

		// Set before into date query. Date query must be specified as an array of an array.
		if ( isset( $registered['before'], $request['before'] ) ) {
			$args['date_query'][0]['before'] = $request['before'];
		}

		// Set after into date query. Date query must be specified as an array of an array.
		if ( isset( $registered['after'], $request['after'] ) ) {
			$args['date_query'][0]['after'] = $request['after'];
		}

		// Ensure our per_page parameter overrides any provided posts_per_page filter.
		if ( isset( $registered['per_page'] ) ) {
			$args['posts_per_page'] = $request['per_page'];
		}

		// Force the post_type argument, since it's not a user input variable.
		$args['post_type'] = $this->post_type;

		/**
		 * Filters the query arguments for a request.
		 *
		 * Enables adding extra arguments or setting defaults for a post collection request.
		 *
		 * @link https://developer.wordpress.org/reference/classes/wp_query/
		 *
		 * @since 1.0.0
		 *
		 * @param array           $args    Key value array of query var to query value.
		 * @param WP_REST_Request $request The request used.
		 */
		$args       = apply_filters( "rest_{$this->post_type}_query", $args, $request );
		$query_args = $this->prepare_items_query( $args, $request );

		$taxonomies = wp_list_filter( get_object_taxonomies( $this->post_type, 'objects' ), [ 'show_in_rest' => true ] );

		if ( ! empty( $request['tax_relation'] ) ) {
			$query_args['tax_query'] = [ 'relation' => $request['tax_relation'] ]; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		}

		foreach ( $taxonomies as $taxonomy ) {
			$base        = ! empty( $taxonomy->rest_base ) ? $taxonomy->rest_base : $taxonomy->name;
			$tax_exclude = $base . '_exclude';

			if ( ! empty( $request[ $base ] ) ) {
				$query_args['tax_query'][] = [
					'taxonomy'         => $taxonomy->name,
					'field'            => 'term_id',
					'terms'            => $request[ $base ],
					'include_children' => false,
				];
			}

			if ( ! empty( $request[ $tax_exclude ] ) ) {
				$query_args['tax_query'][] = [
					'taxonomy'         => $taxonomy->name,
					'field'            => 'term_id',
					'terms'            => $request[ $tax_exclude ],
					'include_children' => false,
					'operator'         => 'NOT IN',
				];
			}
		}

		// Add counts for other statuses.
		$statuses = [
			'all'     => [ 'publish', 'draft', 'future', 'private' ],
			'publish' => 'publish',
			'future'  => 'future',
			'draft'   => 'draft',
			'private' => 'private',
		];

		$statuses_count = [];

		// Strip down query for speed.
		$query_args['fields']                 = 'ids';
		$query_args['posts_per_page']         = 1;
		$query_args['update_post_meta_cache'] = false;
		$query_args['update_post_term_cache'] = false;

		foreach ( $statuses as $key => $status ) {
			$posts_query               = new WP_Query();
			$query_args['post_status'] = $status;
			$posts_query->query( $query_args );
			$statuses_count[ $key ] = absint( $posts_query->found_posts );
		}

		// Encode the array as headers do not support passing an array.
		$encoded_statuses = wp_json_encode( $statuses_count );
		if ( $encoded_statuses ) {
			$response->header( 'X-WP-TotalByStatus', $encoded_statuses );
		}

		if ( $request['_web_stories_envelope'] ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$response = rest_get_server()->envelope_response( $response, isset( $request['_embed'] ) ? $request['_embed'] : false );
		}
		return $response;
	}

	/**
	 * Prepares links for the request.
	 *
	 * @param WP_Post $post Post object.
	 *
	 * @return array Links for the given post.
	 */
	protected function prepare_links( $post ) {
		$links = parent::prepare_links( $post );

		$base     = sprintf( '%s/%s', $this->namespace, $this->rest_base );
		$lock_url = rest_url( trailingslashit( $base ) . $post->ID . '/lock' );

		$links['https://api.w.org/lock'] = [
			'href'       => $lock_url,
			'embeddable' => true,
		];

		$lock = get_post_meta( $post->ID, '_edit_lock', true );

		if ( $lock ) {
			$lock                 = explode( ':', $lock );
			list ( $time, $user ) = $lock;

			/** This filter is documented in wp-admin/includes/ajax-actions.php */
			$time_window = apply_filters( 'wp_check_post_lock_window', 150 );

			if ( $time && $time > time() - $time_window ) {
				$links['https://api.w.org/lockuser'] = [
					'href'       => rest_url( sprintf( '%s/%s', $this->namespace, 'users/' ) . $user ),
					'embeddable' => true,
				];
			}
		}

		return $links;
	}

	/**
	 * Retrieves the query params for the posts collection.
	 *
	 * @since 1.0.0
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();

		$query_params['_web_stories_envelope'] = [
			'description' => __( 'Envelope request for preloading.', 'web-stories' ),
			'type'        => 'boolean',
			'default'     => false,
		];

		$query_params['web_stories_demo'] = [
			'description' => __( 'Load demo data.', 'web-stories' ),
			'type'        => 'boolean',
			'default'     => false,
		];

		return $query_params;
	}
}
