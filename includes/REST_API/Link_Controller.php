<?php
/**
 * Class Link_Controller
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

use DOMDocument;
use DOMElement;
use DOMNodeList;
use DOMXpath;
use WP_Error;
use WP_Http;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * API endpoint to allow parsing of metadata from a URL
 *
 * Class Link_Controller
 */
class Link_Controller extends WP_REST_Controller {
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'link';
	}

	/**
	 * Registers routes for links.
	 *
	 * @see register_rest_route()
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'parse_link' ],
					'permission_callback' => [ $this, 'parse_link_permissions_check' ],
					'args'                => [
						'url'       => [
							'description'       => __( 'The URL to process.', 'web-stories' ),
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'esc_url_raw',
						],
					],
				],
			]
		);
	}

	/**
	 * Parses a URL to return some metadata for inserting links.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function parse_link( $request ) {
		$url = untrailingslashit( $request['url'] );

		/**
		 * Filters the link data TTL value.
		 *
		 * @param int $time Time to live (in seconds). Default is 1 day.
		 * @param string $url The attempted URL.
		 */
		$cache_ttl = apply_filters( 'web_stories_link_data_cache_ttl', DAY_IN_SECONDS, $url );
		$cache_key = 'web_stories_link_data_' . md5( $url );

		$data = get_transient( $cache_key );
		if ( ! empty( $data ) ) {
			return json_decode( $data, true );
		}

		$title       = '';
		$image       = '';
		$description = '';

		$data = [
			'title'       => $title,
			'image'       => $image,
			'description' => $description,
		];

		$args = [
			'limit_response_size' => 153600, // 150 KB.
			'timeout' => 7, // Default is 5 seconds.
		];

		/**
		 * Filters the HTTP request args for link data retrieval.
		 *
		 * Can be used to adjust timeout and response size limit.
		 *
		 * @param array $args Arguments used for the HTTP request
		 * @param string $url The attempted URL.
		 */
		$args = apply_filters( 'web_stories_link_data_request_args', $args, $url );

		$response = wp_safe_remote_get( $url, $args );

		if ( WP_Http::OK !== wp_remote_retrieve_response_code( $response ) ) {
			set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );
			return new WP_Error( 'rest_invalid_url', get_status_header_desc( 404 ), array( 'status' => 404 ) );
		}

		$html  = wp_remote_retrieve_body( $response );

		// Strip <body>.
		$html_head_end = stripos( $html, '</head>' );
		if ( $html_head_end ) {
			$html = substr( $html, 0, $html_head_end );
		}

		if ( ! $html ) {
			set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );
			return new WP_Error( 'rest_invalid_url', get_status_header_desc( 404 ), array( 'status' => 404 ) );
		}

		$doc                      = new DOMDocument();
		$doc->strictErrorChecking = false;

		// Suppress warnings generated by loadHTML.
		$errors = libxml_use_internal_errors( true );
		$doc->loadHTML( $html );
		libxml_use_internal_errors( $errors );
		$xpath = new DOMXpath( $doc );

		if ( libxml_get_last_error() ) {
			libxml_clear_errors();

			set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );
			return new WP_Error( 'rest_invalid_url', get_status_header_desc( 404 ), array( 'status' => 404 ) );
		}

		// Link title.

		$title_query = $xpath->query( '//title' );

		if ( $title_query instanceof DOMNodeList && $title_query->length > 0 ) {
			$title_node = $title_query->item( 0 );

			if ( $title_node instanceof DOMElement ) {
				$title = $title_node->textContent;
			}
		}

		if ( ! $title ) {
			$og_title_query = $xpath->query( '//meta[@property="og:title"]' );
			$title = $this->get_dom_attribute_content( $og_title_query, 'content' );
		}

		if ( ! $title ) {
			$og_site_name_query = $xpath->query( '//meta[@property="og:site_name"]' );
			$title = $this->get_dom_attribute_content( $og_site_name_query, 'content' );
		}

		// Site icon.

		$og_image_query = $xpath->query( '//meta[@property="og:image"]' );
		$image = $this->get_dom_attribute_content( $og_image_query, 'content' );

		if ( ! $image ) {
			$icon_query = $xpath->query( '//link[contains(@rel, "icon")]' );
			$image = $this->get_dom_attribute_content( $icon_query, 'content' );
		}

		if ( ! $image ) {
			$touch_icon_query = $xpath->query( '//link[contains(@rel, "apple-touch-icon")]' );
			$image = $this->get_dom_attribute_content( $touch_icon_query, 'href' );
		}

		// Link description.
		$description_query = $xpath->query( '//meta[@name="description"]' );
		$description = $this->get_dom_attribute_content( $description_query, 'content' );

		if ( ! $description ) {
			$og_description_query = $xpath->query( '//meta[@property="og:description"]' );
			$description          = $this->get_dom_attribute_content( $og_description_query, 'content' );
		}

		$data = [
			'title'       => $title ?: '',
			'image'       => $image ?: '',
			'description' => $description ?: '',
		];

		set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );

		return rest_ensure_response( $data );
	}

	/**
	 * Retrieve content of a given DOM node attribute.
	 *
	 * @param DOMNodeList<DOMElement>|false $query XPath query result.
	 * @param string $attribute Attribute name.
	 *
	 * @return string|false Attribute content on success, false otherwise.
	 */
	private function get_dom_attribute_content( $query, $attribute ) {
		if ( ! $query instanceof DOMNodeList || $query->length === 0 ) {
			return false;
		}

		/** @var DOMElement $node */
		$node = $query->item( 0 );

		if ( ! $node instanceof DOMElement ) {
			return false;
		}

		return $node->getAttribute( $attribute );
	}

	/**
	 * Checks if current user can process links.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function parse_link_permissions_check() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error( 'rest_forbidden', __( 'Sorry, you are not allowed to process links.', 'web-stories' ), array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}
}
