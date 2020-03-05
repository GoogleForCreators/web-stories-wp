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
use DOMXpath;
use WP_Error;
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
				],
				'schema' => [ $this, 'get_public_item_schema' ],
			]
		);
	}

	/**
	 * Parses
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function parse_link( $request ) {
		$url = $request['url'];

		if ( empty( $url ) ) {
			return new WP_Error( 'rest_no_url_provided', __( 'No URL was provided to be parsed.', 'web-stories' ), [ 'status' => 400 ] );
		}

		$request = wp_safe_remote_get(
			$url,
			[
				'limit_response_size' => 153600, // 150 KB.
			]
		);

		$html  = wp_remote_retrieve_body( $request );

		// Strip <body>.
		$html_head_end = stripos( $html, '</head>' );
		if ( $html_head_end ) {
			$html = substr( $html, 0, $html_head_end );
		}

		if ( ! $html ) {
			return new WP_Error( 'rest_url_unreachable', __( 'The given URL could not be reached.', 'web-stories' ), [ 'status' => 400 ] );
		}

		$title       = '';
		$image       = '';
		$description = '';

		$doc                      = new DOMDocument();
		$doc->strictErrorChecking = false;

		$doc->loadHTML( $html );
		$xpath = new DOMXpath( $doc );

		// Link title.
		$title_query        = $xpath->query( '//title' );
		$og_title_query     = $xpath->query( '//meta[@property="og:title"]' );
		$og_site_name_query = $xpath->query( '//meta[@property="og:site_name"]' );
		if ( $title_query->count() ) {
			$title = $title_query->item( 0 )->textContent;
		} else if ( $og_title_query->count() ) {
			$title = $og_title_query->item( 0 )->getAttribute( 'content' );
		} else if ( $og_site_name_query->count() ) {
			$title = $og_site_name_query->item( 0 )->getAttribute( 'content' );
		}

		// Site icon.
		$og_image_query   = $xpath->query( '//meta[@property="og:image"]' );
		$icon_query       = $xpath->query( '//link[contains(@rel, "icon")]' );
		$touch_icon_query = $xpath->query( '//link[contains(@rel, "apple-touch-icon")]' );
		if ( $og_image_query->count() ) {
			$image = $og_image_query->item( 0 )->getAttribute( 'content' );
		} else if ( $icon_query->count() ) {
			$image = $icon_query->item( 0 )->getAttribute( 'href' );
		} else if ( $touch_icon_query->count() ) {
			$image = $touch_icon_query->item( 0 )->getAttribute( 'href' );
		}

		// Link description.
		$description_query    = $xpath->query( '//meta[@name="description"]' );
		$og_description_query = $xpath->query( '//meta[@property="og:description"]' );
		if ( $description_query->count() ) {
			$description = $description_query->item( 0 )->getAttribute( 'content' );
		} else if ( $og_description_query->count() ) {
			$description = $og_description_query->item( 0 )->getAttribute( 'content' );
		}

		$parsed_tags = [
			'title'       => $title,
			'image'       => $image,
			'description' => $description,
		];

		return rest_ensure_response( $parsed_tags );
	}

	/**
	 * Checks if a given request has access to process urls.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return bool|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function parse_link_permissions_check( $request ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		return current_user_can( 'edit_posts' );
	}
}
