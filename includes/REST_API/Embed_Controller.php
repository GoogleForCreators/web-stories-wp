<?php
/**
 * Class Embed_Controller
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

use DOMNodeList;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Document_Parser;
use Google\Web_Stories\Traits\Post_Type;
use WP_Error;
use WP_Http;
use WP_Post;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * API endpoint to facilitate embedding web stories.
 *
 * Class Embed_Controller
 */
class Embed_Controller extends REST_Controller {
	use Document_Parser;
	use Post_Type;
	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'embed';
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
					'callback'            => [ $this, 'get_proxy_item' ],
					'permission_callback' => [ $this, 'get_proxy_item_permissions_check' ],
					'args'                => [
						'url' => [
							'description' => __( 'The URL for which to fetch embed data.', 'web-stories' ),
							'required'    => true,
							'type'        => 'string',
							'format'      => 'uri',
						],
					],
				],
			]
		);
	}

	/**
	 * Callback for the Web Stories embed endpoints.
	 *
	 * Returns information about the given story.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_proxy_item( $request ) {
		$url = urldecode( untrailingslashit( $request['url'] ) );

		if ( empty( $url ) ) {
			return new WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		/**
		 * Filters the link data TTL value.
		 *
		 * @since 1.0.0
		 *
		 * @param int $time Time to live (in seconds). Default is 1 day.
		 * @param string $url The attempted URL.
		 */
		$cache_ttl = apply_filters( 'web_stories_embed_data_cache_ttl', DAY_IN_SECONDS, $url );
		$cache_key = 'web_stories_embed_data_' . md5( $url );

		$data = get_transient( $cache_key );
		if ( ! empty( $data ) ) {
			if ( 'rest_invalid_story' === $data ) {
				return new WP_Error( 'rest_invalid_story', __( 'URL is not a story', 'web-stories' ), [ 'status' => 404 ] );
			}

			return rest_ensure_response( json_decode( $data, true ) );
		}

		$data = $this->get_data_from_post( $url );
		if ( $data ) {
			return rest_ensure_response( $data );
		}

		$args = [
			'limit_response_size' => 153600, // 150 KB.
			'timeout'             => 7, // phpcs:ignore WordPressVIPMinimum.Performance.RemoteRequestTimeout.timeout_timeout
		];

		/**
		 * Filters the HTTP request args for link data retrieval.
		 *
		 * Can be used to adjust timeout and response size limit.
		 *
		 * @since 1.0.0
		 *
		 * @param array $args Arguments used for the HTTP request
		 * @param string $url The attempted URL.
		 */
		$args = apply_filters( 'web_stories_embed_data_request_args', $args, $url );

		$response = wp_safe_remote_get( $url, $args );

		if ( WP_Http::OK !== wp_remote_retrieve_response_code( $response ) ) {
			// Not saving the error response to cache since the error might be temporary.
			return new WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		$html = wp_remote_retrieve_body( $response );

		if ( ! $html ) {
			return new WP_Error( 'rest_invalid_story', __( 'URL is not a story', 'web-stories' ), [ 'status' => 404 ] );
		}

		$data = $this->get_data_from_document( $html );

		if ( ! $data ) {
			return new WP_Error( 'rest_invalid_story', __( 'URL is not a story', 'web-stories' ), [ 'status' => 404 ] );
		}

		set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );

		return rest_ensure_response( $data );
	}

	/**
	 * Retrieves the story metadata for a given URL on the current site.
	 *
	 * @since 1.0.0
	 *
	 * @param string $url  The URL that should be inspected for metadata.
	 *
	 * @return array|false Story metadata if the URL does belong to the current site. False otherwise.
	 */
	private function get_data_from_post( $url ) {
		$post = $this->url_to_post( $url );

		if ( ! $post || Story_Post_Type::POST_TYPE_SLUG !== $post->post_type ) {
			return false;
		}

		return $this->get_data_from_document( $post->post_content );
	}

	/**
	 * Examines a URL and try to determine the post it represents.
	 *
	 * Checks are supposedly from the hosted site blog.
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @see get_oembed_response_data_for_url
	 * @see url_to_postid
	 *
	 * @since 1.2.0
	 *
	 * @param string $url Permalink to check.
	 * @return WP_Post|null Post object on success, null otherwise.
	 */
	private function url_to_post( $url ) {
		$post          = null;
		$switched_blog = false;

		if ( is_multisite() ) {
			$url_parts = wp_parse_args(
				wp_parse_url( $url ),
				[
					'host' => '',
					'path' => '/',
				]
			);

			$qv = [
				'domain'                 => $url_parts['host'],
				'path'                   => '/',
				'number'                 => 1,
				'update_site_cache'      => false,
				'update_site_meta_cache' => false,
			];

			// In case of subdirectory configs, set the path.
			if ( ! is_subdomain_install() ) {
				// Get "sub-site" part of "http://example.org/sub-site/web-stories/my-story/".
				// But given just "http://example.org/web-stories/my-story/", don't treat "web-stories" as site path.
				// This differs from the logic in get_oembed_response_data_for_url() which does not do this.
				// TODO: Investigate possible core bug in get_oembed_response_data_for_url()?
				$path    = explode( '/', ltrim( $url_parts['path'], '/' ) );
				$path    = count( $path ) > 2 ? reset( $path ) : false;
				$network = get_network();
				if ( $path && $network instanceof \WP_Network ) {
					$qv['path'] = $network->path . $path . '/';
				}
			}

			$sites = (array) get_sites( $qv );
			$site  = reset( $sites );

			if ( $site && get_current_blog_id() !== (int) $site->blog_id ) {
				switch_to_blog( $site->blog_id );
				$switched_blog = true;
			}
		}

		if ( function_exists( 'wpcom_vip_url_to_postid' ) ) {
			$post_id = wpcom_vip_url_to_postid( $url );
		} else {
			// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions
			$post_id = url_to_postid( $url );
		}

		if ( $post_id ) {
			$post = get_post( $post_id );
		}

		if ( ! $post_id ) {
			// url_to_postid() does not recognize plain permalinks like https://example.com/?web-story=my-story.
			// Let's check for that ourselves.

			$url_host      = str_replace( 'www.', '', wp_parse_url( $url, PHP_URL_HOST ) );
			$home_url_host = str_replace( 'www.', '', wp_parse_url( home_url(), PHP_URL_HOST ) );

			if ( $url_host === $home_url_host ) {
				$values = [];
				if (
				preg_match(
					'#[?&](' . preg_quote( Story_Post_Type::POST_TYPE_SLUG, '#' ) . ')=([^&]+)#',
					$url,
					$values
				)
				) {
					$slug = $values[2];

					if ( function_exists( 'wpcom_vip_get_page_by_path' ) ) {
						$post = wpcom_vip_get_page_by_path( $slug, OBJECT, Story_Post_Type::POST_TYPE_SLUG );
					} else {
						// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions
						$post = get_page_by_path( $slug, OBJECT, Story_Post_Type::POST_TYPE_SLUG );
					}
				}
			}
		}

		if ( $switched_blog ) {
			restore_current_blog();
		}

		if ( ! $post instanceof WP_Post ) {
			return null;
		}

		return $post;
	}

	/**
	 * Parses an HTML document to and returns the story's title and poster.
	 *
	 * @since 1.0.0
	 *
	 * @param string $html HTML document markup.
	 *
	 * @return array|false Response data or false if document is not a story.
	 */
	private function get_data_from_document( $html ) {
		$xpath = $this->html_to_xpath( $html );

		if ( ! $xpath ) {
			return false;
		}

		$amp_story = $xpath->query( '//amp-story' );

		if ( ! $amp_story instanceof DOMNodeList || 0 === $amp_story->length ) {
			return false;
		}

		$title  = $this->get_dom_attribute_content( $amp_story, 'title' );
		$poster = $this->get_dom_attribute_content( $amp_story, 'poster-portrait-src' );

		return [
			'title'  => $title ?: '',
			'poster' => $poster ?: '',
		];
	}


	/**
	 * Checks if current user can process links.
	 *
	 * @since 1.0.0
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_proxy_item_permissions_check() {
		if ( ! $this->get_post_type_cap( Story_Post_Type::POST_TYPE_SLUG, 'edit_posts' ) ) {
			return new WP_Error( 'rest_forbidden', __( 'Sorry, you are not allowed to make proxied embed requests.', 'web-stories' ), [ 'status' => rest_authorization_required_code() ] );
		}

		return true;
	}
}
