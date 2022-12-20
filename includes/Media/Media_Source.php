<?php
/**
 * Class Media_Source
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

use ReflectionClass;

/**
 * Media source "enum" holding all possible term names for the media source taxonomy.
 */
class Media_Source {
	public const EDITOR             = 'editor';
	public const SOURCE_VIDEO       = 'source-video';
	public const SOURCE_IMAGE       = 'source-image';
	public const VIDEO_OPTIMIZATION = 'video-optimization';
	public const PAGE_TEMPLATE      = 'page-template';
	public const GIF_CONVERSION     = 'gif-conversion';
	public const RECORDING          = 'recording';

	/**
	 * Returns all defined media source term names.
	 *
	 * @since 1.29.0
	 *
	 * @return string[] Media sou
	 */
	public function get_all(): array {
		/**
		 * Term names.
		 *
		 * @var string[] $terms
		 */
		$terms = array_values( ( new ReflectionClass( self::class ) )->getConstants() );

		return $terms;
	}
}
