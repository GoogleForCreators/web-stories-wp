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
		$this->namespace = 'amp/v1';
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
					'callback'            => [ $this, 'get_items' ],
					// 'permission_callback' => [ $this, 'get_items_permissions_check' ],
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
	public function get_items( $request ) {
		$url         = $request['url'];

        if ( empty($url) ) {
			return new WP_Error( 'rest_no_url_provided', __( 'No URL was provided to be parsed.', 'web-stories' ), [ 'status' => 400 ] );
		}

        $request = wp_remote_get($url);
        if ( is_wp_error($request) ) {
			return new WP_Error( 'rest_url_unreachable', __( 'The given URL could not be reached.', 'web-stories' ), [ 'status' => 400 ] );
		}

        $body = wp_remote_retrieve_body( $request );

        $doc = new \DOMDocument();
        $doc->strictErrorChecking = FALSE;
        @$doc->loadHTML($body);
        libxml_use_internal_errors(true);
        $html = @simplexml_import_dom($doc);

        try {

            // Title
            $title = $html->xpath('//title')[0]->__toString();
            $ogTitle = @$html->xpath('//meta[@property="og:title"]')[0]['content']->__toString();
            $ogSitename = $html->xpath('//meta[@property="og:site_name"]')[0]['content']->__toString();
        
            // Image
            $ogImage = $html->xpath('//meta[@property="og:image"]')[0]['content']->__toString();
            $icon = $html->xpath('//link[contains(@rel, "icon")]')[0]['href']->__toString();
            $touchIcon = $html->xpath('//link[contains(@rel, "apple-touch-icon")]')[0]['href']->__toString();
    
            // Description
            $desc = $html->xpath('//meta[@name="description"]')[0]['content']->__toString();
            $ogDesc = $html->xpath('//meta[@property="og:description"]')[0]['content']->__toString();

        } catch (\Throwable $th) {
            // Do nothing
        }

        $parsed_tags = [
            'title' => $ogTitle ?? $title ?? $ogSitename,
            'image' => $touchIcon ?? $ogImage ?? $icon,
            'description' => $ogDesc ?? $desc
        ];
		$response = rest_ensure_response( $parsed_tags );
		return $response;
    }
    
	/**
	 * Checks if a given request has access to process urls.
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return bool|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_items_permissions_check( $request ) { // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UnusedVariable
		return current_user_can( 'edit_posts' );
	}
}
