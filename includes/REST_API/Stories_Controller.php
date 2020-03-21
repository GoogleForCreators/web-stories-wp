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

use Google\Web_Stories\Media;
use Google\Web_Stories\Story_Post_Type;
use stdClass;
use WP_Error;
use WP_Post;
use WP_REST_Posts_Controller;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Override the WP_REST_Posts_Controller class to add `post_content_filtered` to REST request.
 *
 * Class Stories_Controller
 */
class Stories_Controller extends WP_REST_Posts_Controller {
	/**
	 * Prepares a single story for create or update. Add post_content_filtered field to save/insert.
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return stdClass|WP_Error Post object or WP_Error.
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared_story = parent::prepare_item_for_database( $request );

		if ( is_wp_error( $prepared_story ) ) {
			return $prepared_story;
		}
		// Ensure that content and story_data are updated together.
		if (
			( ! empty( $request['story_data'] ) && empty( $request['content'] ) ) ||
			( ! empty( $request['content'] ) && empty( $request['story_data'] ) )
		) {
			return new WP_Error( 'rest_empty_content', __( 'content and story_data should always be updated together.', 'web-stories' ), [ 'status' => 412 ] );
		}

		// If the request is updating the content as well, let's make sure the JSON representation of the story is saved, too.
		if ( isset( $request['story_data'] ) ) {
			$prepared_story->post_content_filtered = wp_json_encode( $request['story_data'] );
		}

		return $prepared_story;
	}

	/**
	 * Get the publisher logo.
	 *
	 * @link https://developers.google.com/search/docs/data-types/article#logo-guidelines
	 * @link https://amp.dev/documentation/components/amp-story/#publisher-logo-src-guidelines
	 *
	 * @return string Publisher logo image URL. WordPress logo if no site icon or custom logo defined, and no logo provided via 'amp_site_icon_url' filter.
	 */
	private function get_publisher_logo() {
		$logo_image_url = null;

		// This should be square, at least 96px in width/height. The 512 is used because the site icon would have this size generated.
		$logo_width  = 512;
		$logo_height = 512;

		// Use the Custom Logo if set, but only if it is square.
		$custom_logo_id = get_theme_mod( 'custom_logo' );
		// Since publisher logo is mandatory then doing the check here if theme support custom logo.
		if ( $custom_logo_id ) {
			$custom_logo_img = wp_get_attachment_image_src( $custom_logo_id, [ $logo_width, $logo_height ], false );
			if ( $custom_logo_img && ( $custom_logo_img[2] === $custom_logo_img[1] ) ) {
				$logo_image_url = $custom_logo_img[0];
			}
		}

		// Try Site Icon, though it is not ideal for non-Story because it should be square.
		$site_icon_id = get_option( 'site_icon' );
		if ( empty( $logo_image_url ) && $site_icon_id ) {
			$site_icon_src = wp_get_attachment_image_src( $site_icon_id, [ $logo_width, $logo_height ], false );
			if ( ! empty( $site_icon_src ) ) {
				$logo_image_url = $site_icon_src[0];
			}
		}

		// Fallback to serving the WordPress logo.
		if ( empty( $logo_image_url ) ) {
			$logo_image_url = WEBSTORIES_PLUGIN_DIR_URL . 'assets/images/fallback-wordpress-publisher-logo.png';
		}

		/**
		 * Filters the publisher's logo.
		 *
		 * This should point to a square image.
		 *
		 * @param string $logo_image_url URL to the publisher's logo.
		 */
		return apply_filters( 'web_stories_publisher_logo', $logo_image_url );
	}

	/**
	 * Prepares a single story output for response. Add post_content_filtered field to output.
	 *
	 * @param WP_Post         $post Post object.
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $post, $request ) {
		$response = parent::prepare_item_for_response( $post, $request );
		$fields   = $this->get_fields_for_response( $request );
		$data     = $response->get_data();
		$schema   = $this->get_item_schema();

		if ( in_array( 'story_data', $fields, true ) ) {
			$post_story_data    = json_decode( $post->post_content_filtered, true );
			$data['story_data'] = rest_sanitize_value_from_schema( $post_story_data, $schema['properties']['story_data'] );
		}

		if ( in_array( 'featured_media_url', $fields, true ) ) {
			$image                      = get_the_post_thumbnail_url( $post, 'medium' );
			$data['featured_media_url'] = ! empty( $image ) ? $image : $schema['properties']['featured_media_url']['default'];
		}

		if ( in_array( 'publisher_logo_url', $fields, true ) ) {
			$data['publisher_logo_url'] = $this->get_publisher_logo();
		}

		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->filter_response_by_context( $data, $context );
		$links   = $response->get_links();
		// Wrap the data in a response object.
		$response = rest_ensure_response( $data );
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
		 * @param WP_REST_Response $response The response object.
		 * @param WP_Post $post Post object.
		 * @param WP_REST_Request $request Request object.
		 */
		return apply_filters( "rest_prepare_{$this->post_type}", $response, $post, $request );
	}

	/**
	 * Updates a single post.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $request ) {
		$response = parent::update_item( $request );
		if ( ! is_wp_error( $response ) ) {
			// If publisher logo is set, let's assign that.
			$publisher_logo_id = $request->get_param( 'publisher_logo' );
			if ( $publisher_logo_id ) {
				set_theme_mod( 'custom_logo', $publisher_logo_id );
			}
		}
		return rest_ensure_response( $response );
	}

	/**
	 * Retrieves the attachment's schema, conforming to JSON Schema.
	 *
	 * @return array Item schema as an array.
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->add_additional_fields_schema( $this->schema );
		}
		$schema = parent::get_item_schema();

		$schema['properties']['story_data'] = [
			'description' => __( 'Story data stored as a JSON object. Stored in post_content_filtered field.', 'web-stories' ),
			'context'     => [ 'edit' ],
			'default'     => [],
		];

		$schema['properties']['featured_media_url'] = [
			'description' => __( 'URL for the story\'s poster image (portrait)', 'web-stories' ),
			'type'        => 'string',
			'format'      => 'uri',
			'context'     => [ 'view', 'edit', 'embed' ],
			'readonly'    => true,
			'default'     => '',
		];

		$schema['properties']['publisher_logo_url'] = [
			'description' => __( 'Publisher logo URL.', 'web-stories' ),
			'type'        => 'string',
			'context'     => [ 'views', 'edit' ],
			'format'      => 'uri',
			'default'     => '',
		];

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

}
