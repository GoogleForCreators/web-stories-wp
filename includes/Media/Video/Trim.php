<?php
/**
 * Class Trim
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

/**
 * Class Optimization
 *
 * @package Google\Web_Stories\Media\Video
 */
class Trim extends Service_Base {

	/**
	 * The trim video post meta key.
	 *
	 * @var string
	 */
	const TRIM_POST_META_KEY = 'web_stories_trim';

	/**
	 * Init.
	 *
	 * @since 1.12.0
	 *
	 * @return void
	 */
	public function register() {
		register_meta(
			'post',
			self::TRIM_POST_META_KEY,
			[
				'type'           => 'object',
				'description'    => __( 'Trimmed data for video.', 'web-stories' ),
				'show_in_rest'   => [
					'schema' => [
						'properties' => [
							'original' => [
								'description' => __( 'Original attachment id', 'web-stories' ),
								'type'        => 'integer',
							],
							'start'    => [
								'description' => __( 'Start time in milliseconds', 'web-stories' ),
								'type'        => 'integer',
							],
							'end'      => [
								'description' => __( 'End time in milliseconds', 'web-stories' ),
								'type'        => 'integer',
							],
						],
					],
				],
				'default'        => [],
				'single'         => true,
				'object_subtype' => 'attachment',
			]
		);
	}
}
