<?php
/**
 * Class Embed_Controller
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

use DOMElement;
use DOMNodeList;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use WP_Error;
use WP_Http;
use WP_Network;
use WP_Post;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * Embed controller class.
 *
 * API endpoint to facilitate embedding web stories.
 *
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 *
 * @phpstan-type SchemaEntry array{
 *   description: string,
 *   type: string,
 *   context: string[],
 *   default?: mixed,
 * }
 *
 * @phpstan-type Schema array{
 *   properties: array<string, SchemaEntry>
 * }
 */
class Embed_Controller extends REST_Controller implements HasRequirements {

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private $story_post_type;

	/**
	 * Constructor.
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;

		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'embed';
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because the story post type needs to be registered first.
	 *
	 * @since 1.13.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'story_post_type' ];
	}

	/**
	 * Registers routes for links.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes(): void {
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
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_proxy_item( $request ) {
		/**
		 * Requested URL.
		 *
		 * @var string $url
		 */
		$url = $request['url'];
		$url = urldecode( untrailingslashit( $url ) );

		if ( empty( $url ) ) {
			return new \WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
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

		if ( \is_string( $data ) && ! empty( $data ) ) {
			/**
			 * Decoded cached embed data.
			 *
			 * @var array<string,mixed>|null $embed
			 */
			$embed = json_decode( $data, true );

			if ( $embed ) {
				$response = $this->prepare_item_for_response( $embed, $request );
				return rest_ensure_response( $response );
			}
		}

		$data = $this->get_data_from_post( $url );
		if ( $data ) {
			$response = $this->prepare_item_for_response( $data, $request );

			return rest_ensure_response( $response );
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
		 * @param array<string,mixed> $args Arguments used for the HTTP request
		 * @param string $url The attempted URL.
		 */
		$args = apply_filters( 'web_stories_embed_data_request_args', $args, $url );

		$response = wp_safe_remote_get( $url, $args );

		if ( WP_Http::OK !== wp_remote_retrieve_response_code( $response ) ) {
			// Not saving the error response to cache since the error might be temporary.
			return new \WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		$html = wp_remote_retrieve_body( $response );

		if ( ! $html ) {
			return new \WP_Error( 'rest_invalid_story', __( 'URL is not a story', 'web-stories' ), [ 'status' => 404 ] );
		}

		$data = $this->get_data_from_document( $html );

		if ( ! $data ) {
			return new \WP_Error( 'rest_invalid_story', __( 'URL is not a story', 'web-stories' ), [ 'status' => 404 ] );
		}

		$response = $this->prepare_item_for_response( $data, $request );

		set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );

		return rest_ensure_response( $response );
	}

	/**
	 * Retrieves the story metadata for a given URL on the current site.
	 *
	 * @since 1.0.0
	 *
	 * @param string $url The URL that should be inspected for metadata.
	 * @return array{title: string, poster: string}|false Story metadata if the URL does belong to the current site. False otherwise.
	 */
	private function get_data_from_post( string $url ) {
		$post = $this->url_to_post( $url );

		if ( ! $post || $this->story_post_type->get_slug() !== $post->post_type ) {
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
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 * @SuppressWarnings(PHPMD.CyclomaticComplexity)
	 *
	 * @since 1.2.0
	 *
	 * @see get_oembed_response_data_for_url
	 * @see url_to_postid
	 *
	 * @param string $url Permalink to check.
	 * @return WP_Post|null Post object on success, null otherwise.
	 */
	private function url_to_post( $url ): ?WP_Post {
		$post          = null;
		$switched_blog = false;

		if ( is_multisite() ) {
			/**
			 * URL parts.
			 *
			 * @var array<string, string>|false $url_parts
			 */
			$url_parts = wp_parse_url( $url );
			if ( ! $url_parts ) {
				$url_parts = [];
			}

			$url_parts = wp_parse_args(
				$url_parts,
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
				$path    = \count( $path ) > 2 ? reset( $path ) : false;
				$network = get_network();
				if ( $path && $network instanceof WP_Network ) {
					$qv['path'] = $network->path . $path . '/';
				}
			}

			$sites = (array) get_sites( $qv );
			$site  = reset( $sites );

			if ( $site && get_current_blog_id() !== (int) $site->blog_id ) {
				// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.switch_to_blog_switch_to_blog
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

			/**
			 * The URL's hostname.
			 *
			 * @var string|false|null $url_host
			 */
			$url_host = wp_parse_url( $url, PHP_URL_HOST );
			if ( $url_host ) {
				$url_host = str_replace( 'www.', '', $url_host );
			}

			/**
			 * The home URL's hostname.
			 *
			 * @var string|false|null $home_url_host
			 */
			$home_url_host = wp_parse_url( home_url(), PHP_URL_HOST );
			if ( $home_url_host ) {
				$home_url_host = str_replace( 'www.', '', $home_url_host );
			}

			if ( $url_host && $home_url_host && $url_host === $home_url_host ) {
				$values = [];
				if (
				preg_match(
					'#[?&](' . preg_quote( $this->story_post_type->get_slug(), '#' ) . ')=([^&]+)#',
					$url,
					$values
				)
				) {
					$slug = $values[2];

					if ( function_exists( 'wpcom_vip_get_page_by_path' ) ) {
						$post = wpcom_vip_get_page_by_path( $slug, OBJECT, $this->story_post_type->get_slug() );
					} else {
						// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions
						$post = get_page_by_path( $slug, OBJECT, $this->story_post_type->get_slug() );
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
	 * @return array{title: string, poster: string}|false Response data or false if document is not a story.
	 */
	private function get_data_from_document( string $html ) {
		try {
			$doc = Document::fromHtml( $html );
		} catch ( \DOMException $exception ) {
			return false;
		}

		if ( ! $doc ) {
			return false;
		}

		/**
		 * List of <amp-story> elements.
		 *
		 * @var DOMNodeList<DOMElement> $amp_story
		 */
		$amp_story = $doc->xpath->query( '//amp-story' );

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
	 * Retrieve content of a given DOM node attribute.
	 *
	 * @since 1.0.0
	 *
	 * @param DOMNodeList<DOMElement>|false $query     XPath query result.
	 * @param string                        $attribute Attribute name.
	 * @return string|false Attribute content on success, false otherwise.
	 */
	protected function get_dom_attribute_content( $query, string $attribute ): string|bool {
		if ( ! $query instanceof DOMNodeList || 0 === $query->length ) {
			return false;
		}

		/**
		 * DOMElement
		 *
		 * @var DOMElement $node
		 */
		$node = $query->item( 0 );

		if ( ! $node instanceof DOMElement ) {
			return false;
		}

		return $node->getAttribute( $attribute );
	}

	/**
	 * Prepares a single embed output for response.
	 *
	 * @since 1.10.0
	 *
	 * @param array<string, mixed>|false $embed Embed value, default to false is not set.
	 * @param WP_REST_Request            $request Request object.
	 * @return WP_REST_Response|WP_Error Response object.
	 */
	public function prepare_item_for_response( $embed, $request ) {
		$fields = $this->get_fields_for_response( $request );
		$schema = $this->get_item_schema();

		$data = [];

		if ( \is_array( $embed ) ) {
			$check_fields = array_keys( $embed );
			foreach ( $check_fields as $check_field ) {
				if ( ! empty( $schema['properties'][ $check_field ] ) && rest_is_field_included( $check_field, $fields ) ) {
					$data[ $check_field ] = rest_sanitize_value_from_schema( $embed[ $check_field ], $schema['properties'][ $check_field ] );
				}
			}
		}

		/**
		 * Request context.
		 *
		 * @var string $context
		 */
		$context = ! empty( $request['context'] ) ? $request['context'] : 'view';
		$data    = $this->add_additional_fields_to_object( $data, $request );
		$data    = $this->filter_response_by_context( $data, $context );

		return rest_ensure_response( $data );
	}


	/**
	 * Retrieves the link's schema, conforming to JSON Schema.
	 *
	 * @since 1.10.0
	 *
	 * @return array Item schema data.
	 *
	 * @phpstan-return Schema
	 */
	public function get_item_schema(): array {
		if ( $this->schema ) {
			/**			 * @
			 * @phpstan-var Schema
			 */
			$schema = $this->add_additional_fields_schema( $this->schema );
			return $schema;
		}

		$schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'embed',
			'type'       => 'object',
			'properties' => [
				'title'  => [
					'description' => __( 'Embed\'s title', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'poster' => [
					'description' => __( 'Embed\'s image', 'web-stories' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
			],
		];

		$this->schema = $schema;

		/**
		 * @phpstan-var Schema
		 */
		$schema = $this->add_additional_fields_schema( $this->schema );
		return $schema;
	}

	/**
	 * Checks if current user can process links.
	 *
	 * @since 1.0.0
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_proxy_item_permissions_check() {
		if ( ! $this->story_post_type->has_cap( 'edit_posts' ) ) {
			return new \WP_Error( 'rest_forbidden', __( 'Sorry, you are not allowed to make proxied embed requests.', 'web-stories' ), [ 'status' => rest_authorization_required_code() ] );
		}

		return true;
	}
}
