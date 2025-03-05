<?php
/**
 * Class Muting
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

declare(strict_types = 1);

namespace Google\Web_Stories\Media\Video;

use Google\Web_Stories\Infrastructure\HasMeta;
use Google\Web_Stories\Infrastructure\PluginUninstallAware;
use Google\Web_Stories\Service_Base;
use WP_Error;
use WP_Post;

/**
 * Class Muting
 */
class Muting extends Service_Base implements HasMeta, PluginUninstallAware {

	/**
	 * Is muted.
	 */
	public const IS_MUTED_POST_META_KEY = 'web_stories_is_muted';

	/**
	 * The muted video id post meta key.
	 */
	public const MUTED_ID_POST_META_KEY = 'web_stories_muted_id';

	/**
	 * Is muted.
	 */
	public const IS_MUTED_REST_API_KEY = 'web_stories_is_muted';

	/**
	 * Register.
	 *
	 * @since 1.10.0
	 */
	public function register(): void {
		$this->register_meta();

		add_action( 'delete_attachment', [ $this, 'delete_video' ] );
		add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ] );
	}

	/**
	 * Register meta for attachment post type.
	 *
	 * @since 1.10.0
	 */
	public function register_meta(): void {
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
	 */
	public function rest_api_init(): void {
		register_rest_field(
			'attachment',
			self::IS_MUTED_REST_API_KEY,
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
	 * @param array|mixed $response Array of prepared attachment data.
	 * @return array|mixed Response data.
	 *
	 * @template T
	 *
	 * @phpstan-return ($response is array<T> ? array<T> : mixed)
	 */
	public function wp_prepare_attachment_for_js( $response ) {
		if ( ! \is_array( $response ) ) {
			return $response;
		}
		if ( 'video' === $response['type'] ) {
			$response[ self::IS_MUTED_REST_API_KEY ] = $this->get_callback_is_muted( $response );
		}

		return $response;
	}

	/**
	 * Get the attachment's post meta.
	 *
	 * @since 1.10.0
	 *
	 * @param array<string, mixed> $prepared Array of data to add to.
	 */
	public function get_callback_is_muted( array $prepared ): ?bool {
		/**
		 * Attachment ID.
		 *
		 * @var int $id
		 */
		$id = $prepared['id'];

		/**
		 * Muted value.
		 *
		 * @var bool|null $value
		 */
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
	 * @param mixed   $value  Value to updated.
	 * @param WP_Post $post   Post object to be updated.
	 * @return true|WP_Error
	 */
	public function update_callback_is_muted( $value, WP_Post $post ) {
		$object_id = $post->ID;
		$name      = self::IS_MUTED_REST_API_KEY;
		$meta_key  = self::IS_MUTED_POST_META_KEY;

		if ( ! current_user_can( 'edit_post_meta', $object_id, $meta_key ) ) {
			return new \WP_Error(
				'rest_cannot_update',
				/* translators: %s: Custom field key.**/
				\sprintf( __( 'Sorry, you are not allowed to edit the %s custom field.', 'web-stories' ), $name ),
				[
					'key'    => $name,
					'status' => rest_authorization_required_code(),
				]
			);
		}

		update_post_meta( $object_id, $meta_key, $value );

		return true;
	}

	/**
	 * Deletes associated meta data when a video is deleted.
	 *
	 * @since 1.26.0
	 *
	 * @param int $attachment_id ID of the attachment to be deleted.
	 */
	public function delete_video( int $attachment_id ): void {
		delete_metadata( 'post', 0, self::MUTED_ID_POST_META_KEY, $attachment_id, true );
	}

	/**
	 * Act on plugin uninstall.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
		delete_post_meta_by_key( self::MUTED_ID_POST_META_KEY );
		delete_post_meta_by_key( self::IS_MUTED_POST_META_KEY );
	}
}
