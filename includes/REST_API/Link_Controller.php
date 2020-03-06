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
use DOMNameList;
use DOMNode;
use DOMNodeList;
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
	 * Parses
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function parse_link( $request ) {
		$url = $request['url'];

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
			return new WP_Error( 'rest_invalid_url', get_status_header_desc( 404 ), array( 'status' => 404 ) );
		}

		$title       = '';
		$image       = '';
		$description = '';

		$doc                      = new DOMDocument();
		$doc->strictErrorChecking = false;

		$doc->loadHTML( $html );
		$xpath = new DOMXpath( $doc );

		// Link title.
		/* @var DOMNodeList $title_query */
		$title_query = $xpath->query( '//title' );
		/* @var DOMNodeList $og_title_query */
		$og_title_query = $xpath->query( '//meta[@property="og:title"]' );
		/* @var DOMNodeList $og_site_name_query */
		$og_site_name_query = $xpath->query( '//meta[@property="og:site_name"]' );
		if ( $title_query instanceof DOMNodeList && $title_query->count() ) {
			/** @var \DOMElement $title_node */
			$title_node = $title_query->item( 0 );

			if ( $title_node instanceof \DOMElement ) {
				$title = $title_node->textContent;
			}
		} else if ( $og_title_query instanceof DOMNodeList && $og_title_query->count() ) {
			/** @var \DOMElement $title_node */
			$title_node = $og_title_query->item( 0 );

			if ( $title_node instanceof \DOMElement ) {
				$title = $title_node->getAttribute( 'content' );
			}
		} else if ( $og_site_name_query instanceof DOMNodeList && $og_site_name_query->count() ) {
			/** @var \DOMElement $title_node */
			$title_node = $og_site_name_query->item( 0 );

			if ( $title_node instanceof \DOMElement ) {
				$title = $title_node->getAttribute( 'content' );
			}
		}

		// Site icon.
		/* @var DOMNodeList $og_image_query */
		$og_image_query = $xpath->query( '//meta[@property="og:image"]' );
		/* @var DOMNodeList $icon_query */
		$icon_query = $xpath->query( '//link[contains(@rel, "icon")]' );
		/* @var DOMNodeList $touch_icon_query */
		$touch_icon_query = $xpath->query( '//link[contains(@rel, "apple-touch-icon")]' );
		if ( $og_image_query instanceof DOMNodeList && $og_image_query->count() ) {
			/** @var \DOMElement $image_node */
			$image_node = $og_image_query->item( 0 );
			if ( $image_node instanceof \DOMElement ) {
				$image = $image_node->getAttribute( 'content' );
			}
		} else if ( $icon_query instanceof DOMNodeList && $icon_query->count() ) {
			/** @var \DOMElement $image_node */
			$image_node = $icon_query->item( 0 );

			if ( $image_node instanceof \DOMElement ) {
				$image = $image_node->getAttribute( 'href' );
			}
		} else if ( $touch_icon_query instanceof DOMNodeList && $touch_icon_query->count() ) {
			/** @var \DOMElement $image_node */
			$image_node = $touch_icon_query->item( 0 );

			if ( $image_node instanceof \DOMElement ) {
				$image = $image_node->getAttribute( 'href' );
			}
		}

		// Link description.
		/* @var DOMNodeList $description_query */
		$description_query = $xpath->query( '//meta[@name="description"]' );
		/* @var DOMNodeList $og_description_query */
		$og_description_query = $xpath->query( '//meta[@property="og:description"]' );

		if ( $description_query instanceof DOMNodeList && $description_query->count() ) {
			/** @var \DOMElement $description_node */
			$description_node = $description_query->item( 0 );

			if ( $description_node instanceof \DOMElement ) {
				$description = $description_node->getAttribute( 'content' );
			}
		} else if ( $og_description_query instanceof DOMNodeList && $og_description_query->count() ) {
			/** @var \DOMElement $description_node */
			$description_node = $og_description_query->item( 0 );

			if ( $description_node instanceof \DOMElement ) {
				$description = $description_node->getAttribute( 'content' );
			}
		}

		$parsed_tags = [
			'title'       => $title,
			'image'       => $image,
			'description' => $description,
		];

		return rest_ensure_response( $parsed_tags );
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
