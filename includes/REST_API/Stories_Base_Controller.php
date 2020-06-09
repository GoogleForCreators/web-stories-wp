<?php
/**
 * Class Stories_Base_Controller
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

use Google\Web_Stories\KSES;
use stdClass;
use WP_Error;
use WP_Post;
use WP_REST_Posts_Controller;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Stories_Base_Controller class.
 *
 * Override the WP_REST_Posts_Controller class to add `post_content_filtered` to REST request.
 */
class Stories_Base_Controller extends WP_REST_Posts_Controller {
	/**
	 * Prepares a single template for create or update. Add post_content_filtered field to save/insert.
	 *
	 * @param WP_REST_Request $request Request object.
	 *
	 * @return stdClass|WP_Error Post object or WP_Error.
	 */
	protected function prepare_item_for_database( $request ) {
		$prepared_template = parent::prepare_item_for_database( $request );

		if ( is_wp_error( $prepared_template ) ) {
			return $prepared_template;
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
			$prepared_template->post_content_filtered = wp_json_encode( $request['story_data'] );
		}

		return $prepared_template;
	}

	/**
	 * Prepares a single template output for response.
	 *
	 * Adds post_content_filtered field to output.
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
	 * Creates a single post.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		add_filter( 'wp_kses_allowed_html', [ $this, 'filter_kses_allowed_html' ], 10, 2 );
		add_filter( 'content_save_pre', [ $this, 'filter_content_save_pre_before_kses' ], 0 );
		add_filter( 'content_save_pre', [ $this, 'filter_content_save_pre_after_kses' ], 20 );
		remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
		$response = parent::create_item( $request );
		add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
		return $response;
	}

	/**
	 * Updates a single post.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return \WP_REST_Response|\WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function update_item( $request ) {
		add_filter( 'wp_kses_allowed_html', [ $this, 'filter_kses_allowed_html' ], 10, 2 );
		add_filter( 'content_save_pre', [ $this, 'filter_content_save_pre_before_kses' ], 0 );
		add_filter( 'content_save_pre', [ $this, 'filter_content_save_pre_after_kses' ], 20 );
		remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
		$response = parent::update_item( $request );
		add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
		return $response;
	}

	/**
	 * Retrieves the story's schema, conforming to JSON Schema.
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

		$this->schema = $schema;

		return $this->add_additional_fields_schema( $this->schema );
	}

	/**
	 * Filter the allowed tags for KSES to allow for complete amp-story document markup.
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
			'amp-animation'             => [],
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
		];

		$allowed_tags = array_merge( $allowed_tags, $story_components );

		foreach ( $allowed_tags as &$allowed_tag ) {
			$allowed_tag['animate-in']          = true;
			$allowed_tag['animate-in-duration'] = true;
			$allowed_tag['animate-in-delay']    = true;
			$allowed_tag['animate-in-after']    = true;
			$allowed_tag['layout']              = true;
		}

		return $allowed_tags;
	}

	/**
	 * Temporarily renames the style attribute to data-temp-style.
	 *
	 * @param string $post_content Post content.
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
	 * Renames data-temp-style back to style and applies custom KSES filtering.
	 *
	 * @param string $post_content Post content.
	 * @return string Filtered post content.
	 */
	public function filter_content_save_pre_after_kses( $post_content ) {
		return (string) preg_replace_callback(
			'/ data-temp-style=\\\"(?P<styles>[^"]*)\\\"/',
			static function ( $matches ) {
				return sprintf( ' style="%s"', esc_attr( wp_slash( KSES::safecss_filter_attr( wp_unslash( $matches['styles'] ) ) ) ) );
			},
			$post_content
		);
	}
}
