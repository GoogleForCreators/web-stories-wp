<?php
/**
 * Class Add_Media_Source_Gif_Conversion
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

namespace Google\Web_Stories\Migrations;

/**
 * Class Add_Media_Source_Gif_Conversion
 */
class Add_Media_Source_Gif_Conversion extends Add_Media_Source {
	/**
	 * Term name.
	 *
	 * @since 1.9.0
	 */
	protected function get_term(): string {
		return $this->media_source_taxonomy::TERM_GIF_CONVERSION;
	}
}
