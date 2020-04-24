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

	const STYLE_PRESETS_OPTION = 'web_stories_style_presets';

	/**
	 * Default style presets to pass if not set.
	 */
	const EMPTY_STYLE_PRESETS = [
		'fillColors' => [],
		'textColors' => [],
		'textStyles' => [],
	];

	const PUBLISHER_LOGOS_OPTION = 'web_stories_publisher_logos';
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
			$data['publisher_logo_url'] = Story_Post_Type::get_publisher_logo();
		}

		if ( in_array( 'style_presets', $fields, true ) ) {
			$style_presets         = get_option( self::STYLE_PRESETS_OPTION, self::EMPTY_STYLE_PRESETS );
			$data['style_presets'] = is_array( $style_presets ) ? $style_presets : self::EMPTY_STYLE_PRESETS;
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
				// @todo This option can keep track of all available publisher logo IDs in the future, thus the array.
				$publisher_logo_settings           = get_option( self::PUBLISHER_LOGOS_OPTION, [] );
				$publisher_logo_settings['active'] = $publisher_logo_id;
				update_option( self::PUBLISHER_LOGOS_OPTION, $publisher_logo_settings, false );
			}

			// If style presets are set.
			$style_presets = $request->get_param( 'style_presets' );
			if ( is_array( $style_presets ) ) {
				update_option( self::STYLE_PRESETS_OPTION, $style_presets );
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
			'type'        => 'object',
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

		$schema['properties']['style_presets'] = [
			'description' => __( 'Style presets used by all stories', 'web-stories' ),
			'type'        => 'object',
			'context'     => [ 'view', 'edit' ],
		];

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

}
