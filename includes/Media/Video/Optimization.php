<?php
/**
 * Class Optimization
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
class Optimization extends Service_Base {

	/**
	 * The optimized video id post meta key.
	 *
	 * @var string
	 */
	const OPTIMIZED_ID_POST_META_KEY = 'web_stories_optimized_id';

	/**
	 * Init.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	public function register() {
		register_meta(
			'post',
			self::OPTIMIZED_ID_POST_META_KEY,
			[
				'sanitize_callback' => 'absint',
				'type'              => 'integer',
				'description'       => __( 'ID of optimized video.', 'web-stories' ),
				'show_in_rest'      => true,
				'default'           => 0,
				'single'            => true,
				'object_subtype'    => 'attachment',
			]
		);
	}


}
