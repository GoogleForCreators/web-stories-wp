<?php
/**
 * Class Link_Controller
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

declare(strict_types = 1);

namespace Google\Web_Stories\REST_API;

use DOMElement;
use DOMNode;
use DOMNodeList;
use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * API endpoint to allow parsing of metadata from a URL
 *
 * Class Link_Controller
 *
 * @phpstan-type SchemaEntry array{
 *   description: string,
 *   type: string,
 *   context: string[],
 *   default?: mixed,
 * }
 * @phpstan-type Schema array{
 *   properties: array<string, SchemaEntry>
 * }
 */
class Link_Controller extends REST_Controller implements HasRequirements {

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private Story_Post_Type $story_post_type;

	/**
	 * Constructor.
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;

		$this->namespace = 'web-stories/v1';
		$this->rest_base = 'link';
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
	 * @since 1.0.0
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
					'callback'            => [ $this, 'parse_link' ],
					'permission_callback' => [ $this, 'parse_link_permissions_check' ],
					'args'                => [
						'url' => [
							'description'       => __( 'The URL to process.', 'web-stories' ),
							'required'          => true,
							'type'              => 'string',
							'format'            => 'uri',
							'validate_callback' => [ $this, 'validate_url' ],
						],
					],
				],
			]
		);
	}

	/**
	 * Parses a URL to return some metadata for inserting links.
	 *
	 * @SuppressWarnings(PHPMD.CyclomaticComplexity)
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function parse_link( $request ) {
		/**
		 * Requested URL.
		 *
		 * @var string $url
		 */
		$url = $request['url'];
		$url = untrailingslashit( $url );

		/**
		 * Filters the link data TTL value.
		 *
		 * @since 1.0.0
		 *
		 * @param int $time Time to live (in seconds). Default is 1 day.
		 * @param string $url The attempted URL.
		 */
		$cache_ttl = apply_filters( 'web_stories_link_data_cache_ttl', DAY_IN_SECONDS, $url );
		$cache_key = 'web_stories_link_data_' . md5( $url );

		$data = get_transient( $cache_key );
		if ( \is_string( $data ) && ! empty( $data ) ) {
			/**
			 * Decoded cached link data.
			 *
			 * @var array{title: string, image: string, description: string}|null $link
			 */
			$link = json_decode( $data, true );

			if ( $link ) {
				$response = $this->prepare_item_for_response( $link, $request );
				return rest_ensure_response( $response );
			}
		}

		$data = [
			'title'       => '',
			'image'       => '',
			'description' => '',
		];

		// Do not request instagram.com, as it redirects to a login page.
		// See https://github.com/GoogleForCreators/web-stories-wp/issues/10451.
		$matches      = [];
		$query_string = wp_parse_url( $url, PHP_URL_QUERY );
		$check_url    = \is_string( $query_string ) ? str_replace( "?$query_string", '', $url ) : $url;
		if ( preg_match( '~^https?://(www\.)?instagram\.com/([^/]+)/?$~', $check_url, $matches ) ) {
			$data['title'] = sprintf(
				/* translators: %s: Instagram username. */
				__( 'Instagram - @%s', 'web-stories' ),
				$matches[2]
			);
			set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );
			$response = $this->prepare_item_for_response( $data, $request );

			return rest_ensure_response( $response );
		}

		$args = [
			'limit_response_size' => 153_600, // 150 KB.
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
		$args = apply_filters( 'web_stories_link_data_request_args', $args, $url );

		$response = wp_safe_remote_get( $url, $args );

		if ( is_wp_error( $response ) && 'http_request_failed' === $response->get_error_code() ) {
			return new \WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 404 ] );
		}

		if ( WP_Http::OK !== wp_remote_retrieve_response_code( $response ) ) {
			// Not saving to cache since the error might be temporary.
			$response = $this->prepare_item_for_response( $data, $request );

			return rest_ensure_response( $response );
		}

		$html = wp_remote_retrieve_body( $response );

		// Strip <body>.
		$html_head_end = stripos( $html, '</head>' );
		if ( $html_head_end ) {
			$html = substr( $html, 0, $html_head_end );
		}

		if ( ! $html ) {
			set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );
			$response = $this->prepare_item_for_response( $data, $request );

			return rest_ensure_response( $response );
		}

		try {
			$doc = Document::fromHtml( $html );
		} catch ( \DOMException $exception ) {
			set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );
			$response = $this->prepare_item_for_response( $data, $request );

			return rest_ensure_response( $response );
		}

		if ( ! $doc ) {
			set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );
			$response = $this->prepare_item_for_response( $data, $request );

			return rest_ensure_response( $response );
		}

		$xpath = $doc->xpath;

		// Link title.

		$title       = '';
		$title_query = $xpath->query( '//title' );

		if ( $title_query instanceof DOMNodeList && $title_query->length > 0 ) {
			$title_node = $title_query->item( 0 );

			if ( $title_node instanceof DOMElement ) {
				$title = $title_node->textContent;
			}
		}

		if ( ! $title ) {
			/**
			 * List of found elements.
			 *
			 * @var DOMNodeList<DOMElement> $og_title_query
			 */
			$og_title_query = $xpath->query( '//meta[@property="og:title"]' );
			$title          = $this->get_dom_attribute_content( $og_title_query, 'content' );
		}

		if ( ! $title ) {
			/**
			 * List of found elements.
			 *
			 * @var DOMNodeList<DOMElement> $og_site_name_query
			 */
			$og_site_name_query = $xpath->query( '//meta[@property="og:site_name"]' );
			$title              = $this->get_dom_attribute_content( $og_site_name_query, 'content' );
		}

		// Site icon.

		/**
		 * List of found elements.
		 *
		 * @var DOMNodeList<DOMElement> $og_image_query
		 */
		$og_image_query = $xpath->query( '//meta[@property="og:image"]' );
		$image          = $this->get_dom_attribute_content( $og_image_query, 'content' );

		if ( ! $image ) {
			/**
			 * List of found elements.
			 *
			 * @var DOMNodeList<DOMElement> $icon_query
			 */
			$icon_query = $xpath->query( '//link[contains(@rel, "icon")]' );
			$image      = $this->get_dom_attribute_content( $icon_query, 'content' );
		}

		if ( ! $image ) {
			/**
			 * List of found elements.
			 *
			 * @var DOMNodeList<DOMElement> $touch_icon_query
			 */
			$touch_icon_query = $xpath->query( '//link[contains(@rel, "apple-touch-icon")]' );
			$image            = $this->get_dom_attribute_content( $touch_icon_query, 'href' );
		}

		// Link description.

		/**
		 * List of found elements.
		 *
		 * @var DOMNodeList<DOMElement> $description_query
		 */
		$description_query = $xpath->query( '//meta[@name="description"]' );
		$description       = $this->get_dom_attribute_content( $description_query, 'content' );

		if ( ! $description ) {
			/**
			 * List of found elements.
			 *
			 * @var DOMNodeList<DOMElement> $og_description_query
			 */
			$og_description_query = $xpath->query( '//meta[@property="og:description"]' );
			$description          = $this->get_dom_attribute_content( $og_description_query, 'content' );
		}

		$data = [
			'title'       => $title ?: '',
			'image'       => $image ?: '',
			'description' => $description ?: '',
		];

		$response = $this->prepare_item_for_response( $data, $request );

		set_transient( $cache_key, wp_json_encode( $data ), $cache_ttl );

		return rest_ensure_response( $response );
	}


	/**
	 * Prepares a single lock output for response.
	 *
	 * @since 1.10.0
	 *
	 * @param array{title: string, image: string, description: string} $link Link value, default to false is not set.
	 * @param WP_REST_Request                                          $request Request object.
	 * @return WP_REST_Response|WP_Error Response object.
	 */
	public function prepare_item_for_response( $link, $request ) {
		$fields = $this->get_fields_for_response( $request );
		$schema = $this->get_item_schema();

		$data = [];

		$check_fields = array_keys( $link );
		foreach ( $check_fields as $check_field ) {
			if ( ! empty( $schema['properties'][ $check_field ] ) && rest_is_field_included( $check_field, $fields ) ) {
				$data[ $check_field ] = rest_sanitize_value_from_schema( $link[ $check_field ], $schema['properties'][ $check_field ] );
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

		// Wrap the data in a response object.
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
			/**
			 * Schema.
			 *
			 * @phpstan-var Schema $schema
			 */
			$schema = $this->add_additional_fields_schema( $this->schema );
			return $schema;
		}

		$schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'link',
			'type'       => 'object',
			'properties' => [
				'title'       => [
					'description' => __( 'Link\'s title', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'image'       => [
					'description' => __( 'Link\'s image', 'web-stories' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
				'description' => [
					'description' => __( 'Link\'s description', 'web-stories' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
				],
			],
		];

		$this->schema = $schema;

		/**
		 * Schema
		 *
		 * @phpstan-var Schema $schema
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
	public function parse_link_permissions_check() {
		if ( ! $this->story_post_type->has_cap( 'edit_posts' ) ) {
			return new \WP_Error( 'rest_forbidden', __( 'Sorry, you are not allowed to process links.', 'web-stories' ), [ 'status' => rest_authorization_required_code() ] );
		}

		return true;
	}

	/**
	 * Callback to validate urls.
	 *
	 * @since 1.11.0
	 *
	 * @param string $value Value to be validated.
	 * @return true|WP_Error
	 */
	public function validate_url( $value ) {
		$url = untrailingslashit( $value );

		if ( empty( $url ) || ! wp_http_validate_url( $url ) ) {
			return new \WP_Error( 'rest_invalid_url', __( 'Invalid URL', 'web-stories' ), [ 'status' => 400 ] );
		}

		return true;
	}

	/**
	 * Retrieve content of a given DOM node attribute.
	 *
	 * @since 1.0.0
	 *
	 * @param DOMNodeList<DOMElement>|false $query XPath query result.
	 * @param string                        $attribute Attribute name.
	 * @return string|false Attribute content on success, false otherwise.
	 */
	protected function get_dom_attribute_content( $query, string $attribute ) {
		if ( ! $query instanceof DOMNodeList || 0 === $query->length ) {
			return false;
		}

		/**
		 * DOMElement
		 *
		 * @var DOMElement|DOMNode $node
		 */
		$node = $query->item( 0 );

		if ( ! $node instanceof DOMElement ) {
			return false;
		}

		return $node->getAttribute( $attribute );
	}
}
