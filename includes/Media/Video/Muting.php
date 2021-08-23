<?php
/**
 * Class Muting
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Media\Video;

use Google\Web_Stories\Service_Base;
use WP_Error;

/**
 * Class Muting
 *
 * @package Google\Web_Stories\Media\Video
 */
class Muting extends Service_Base {

	/**
	 * Is muted.
	 *
	 * @var string
	 */
	const IS_MUTED_POST_META_KEY = 'web_stories_is_muted';

	/**
	 * The muted video id post meta key.
	 *
	 * @var string
	 */
	const MUTED_ID_POST_META_KEY = 'web_stories_muted_id';

	/**
	 * Is muted.
	 *
	 * @var string
	 */
	const IS_MUTED_KEY = 'is_muted';

	/**
	 * Register.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	public function register() {
		$this->register_meta();

		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ] );
	}

	/**
	 * Register meta for attachment post type.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	protected function register_meta() {
		register_meta(
			'post',
			self::IS_MUTED_POST_META_KEY,
			[
				'type'           => 'boolean',
				'description'    => __( 'Whether the video is muted', 'web-stories' ),
				'default'        => false,
				'single'         => true,
				'object_subtype' => 'attachment',
			]
		);

		register_meta(
			'post',
			self::MUTED_ID_POST_META_KEY,
			[
				'sanitize_callback' => 'absint',
				'type'              => 'integer',
				'description'       => __( 'ID of muted video.', 'web-stories' ),
				'show_in_rest'      => true,
				'default'           => 0,
				'single'            => true,
				'object_subtype'    => 'attachment',
			]
		);
	}

	/**
	 * Registers additional REST API fields upon API initialization.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	public function rest_api_init() {
		register_rest_field(
			'attachment',
			self::IS_MUTED_KEY,
			[
				'get_callback'    => [ $this, 'get_callback_is_muted' ],
				'schema'          => [
					'type'        => [ 'boolean', 'null' ],
					'description' => __( 'Whether the video is muted', 'web-stories' ),
					'default'     => null,
					'context'     => [ 'view', 'edit', 'embed' ],
					'arg_options' => [
						'sanitize_callback' => 'rest_sanitize_boolean',
					],
				],
				'update_callback' => [ $this, 'update_callback_is_muted' ],
			]
		);
	}

	/**
	 * Filters the attachment data prepared for JavaScript.
	 *
	 * @since 1.10.0
	 *
	 * @param array|mixed $response   Array of prepared attachment data.
	 *
	 * @return array|mixed $response;
	 */
	public function wp_prepare_attachment_for_js( $response ) {
		if ( ! is_array( $response ) ) {
			return $response;
		}
		if ( 'video' === $response['type'] ) {
			$response[ self::IS_MUTED_KEY ] = $this->get_callback_is_muted( $response );
		}

		return $response;
	}

	/**
	 * Get the attachment's post meta.
	 *
	 * @since 1.10.0
	 *
	 * @param array $prepared Array of data to add to.
	 *
	 * @return bool|null
	 */
	public function get_callback_is_muted( $prepared ) {
		$id = $prepared['id'];

		$value = get_metadata_raw( 'post', $id, self::IS_MUTED_POST_META_KEY, true );
		if ( null === $value ) {
			return $value;
		}

		return rest_sanitize_boolean( $value );
	}

	/**
	 * Update the attachment's post meta.
	 *
	 * @since 1.10.0
	 *
	 * @param mixed    $value  Value to updated.
	 * @param \WP_Post $object Post object to be updated.
	 *
	 * @return bool|WP_Error
	 */
	public function update_callback_is_muted( $value, $object ) {
		$object_id = $object->ID;
		$name      = self::IS_MUTED_KEY;
		$meta_key  = self::IS_MUTED_POST_META_KEY;
		$meta_type = 'post';

		if ( ! current_user_can( "edit_{$meta_type}_meta", $object_id, $meta_key ) ) {
			return new WP_Error(
				'rest_cannot_update',
				/* translators: %s: Custom field key.**/
				sprintf( __( 'Sorry, you are not allowed to edit the %s custom field.', 'web-stories' ), $name ),
				[
					'key'    => $name,
					'status' => rest_authorization_required_code(),
				]
			);
		}

		return (bool) update_metadata( $meta_type, $object_id, $meta_key, (int) $value );
	}
}
