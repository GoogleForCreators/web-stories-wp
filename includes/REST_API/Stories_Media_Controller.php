<?php

namespace Google\Web_Stories\REST_API;

class Stories_Media_Controller extends \WP_REST_Attachments_Controller {
	/**
	 * Constructor.
	 *
	 * Override the namespace.
	 *
	 * @param string $post_type Post type.
	 */
	public function __construct( $post_type ) {
		$this->post_type = $post_type;
		$this->namespace = 'web-stories/v1';
		$obj             = get_post_type_object( $post_type );
		$this->rest_base = ! empty( $obj->rest_base ) ? $obj->rest_base : $obj->name;

		$this->meta = new \WP_REST_Post_Meta_Fields( $this->post_type );
	}

	/**
	 * Retrieves a collection of media.
	 *
	 * Read _web_stories_envelope param to envelope response.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$response = parent::get_items( $request );

		if ( $request['_web_stories_envelope'] ) {
			$response = rest_get_server()->envelope_response( $response, false );
		}
		return $response;
	}

	/**
	 * Retrieves the query params for the posts collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();

		$query_params['_web_stories_envelope'] = [
			'description' => __( 'Envelope request for preloading.', 'web-stories' ),
			'type'        => 'boolean',
			'default'     => false,
		];

		return $query_params;
	}
}
