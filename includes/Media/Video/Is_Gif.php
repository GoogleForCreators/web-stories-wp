<?php
/**
 * Class Is_Gif
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

/**
 * Class Is_Gif
 */
class Is_Gif extends Service_Base implements HasMeta, PluginUninstallAware {
	/**
	 * The post meta key.
	 */
	public const IS_GIF_POST_META_KEY = 'web_stories_is_gif';

	/**
	 * Init.
	 *
	 * @since 1.23.0
	 */
	public function register(): void {
		$this->register_meta();
	}

	/**
	 * Register post meta
	 *
	 * @since 1.23.0
	 */
	public function register_meta(): void {
		register_post_meta(
			'attachment',
			self::IS_GIF_POST_META_KEY,
			[
				'sanitize_callback' => 'rest_sanitize_boolean',
				'type'              => 'boolean',
				'description'       => __( 'Whether the video is to be considered a GIF', 'web-stories' ),
				'show_in_rest'      => true,
				'default'           => false,
				'single'            => true,
				'object_subtype'    => 'attachment',
			]
		);
	}

	/**
	 * Filters the attachment data prepared for JavaScript.
	 *
	 * @since 1.23.0
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

		/**
		 * Post ID.
		 *
		 * @var int $post_id
		 */
		$post_id = $response['id'];

		$response[ self::IS_GIF_POST_META_KEY ] = get_post_meta( $post_id, self::IS_GIF_POST_META_KEY, true );

		return $response;
	}

	/**
	 * Act on plugin uninstall.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
		delete_post_meta_by_key( self::IS_GIF_POST_META_KEY );
	}
}
