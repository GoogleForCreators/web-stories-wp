<?php
/**
 * Class Cropping
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

namespace Google\Web_Stories\Media;

use Google\Web_Stories\Infrastructure\HasMeta;
use Google\Web_Stories\Infrastructure\PluginUninstallAware;
use Google\Web_Stories\Service_Base;

/**
 * Class Cropping
 */
class Cropping extends Service_Base implements HasMeta, PluginUninstallAware {

	/**
	 * The cropped video id post meta key.
	 */
	public const CROPPED_ID_POST_META_KEY = 'web_stories_cropped_origin_id';

	/**
	 * Init.
	 *
	 * @since 1.26.0
	 */
	public function register(): void {
		$this->register_meta();
		add_action( 'delete_attachment', [ $this, 'delete_video' ] );
	}

	/**
	 * Register meta
	 *
	 * @since 1.26.0
	 */
	public function register_meta(): void {
		register_meta(
			'post',
			self::CROPPED_ID_POST_META_KEY,
			[
				'sanitize_callback' => 'absint',
				'type'              => 'integer',
				'description'       => __( 'Parent ID if this is a cropped attachment', 'web-stories' ),
				'show_in_rest'      => true,
				'default'           => 0,
				'single'            => true,
				'object_subtype'    => 'attachment',
			]
		);
	}

	/**
	 * Deletes associated meta data when a video is deleted.
	 *
	 * @since 1.26.0
	 *
	 * @param int $attachment_id ID of the attachment to be deleted.
	 */
	public function delete_video( int $attachment_id ): void {
		delete_metadata( 'post', 0, self::CROPPED_ID_POST_META_KEY, $attachment_id, true );
	}

	/**
	 * Act on plugin uninstall.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
		delete_post_meta_by_key( self::CROPPED_ID_POST_META_KEY );
	}
}
