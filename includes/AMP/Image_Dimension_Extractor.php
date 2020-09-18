<?php
/**
 * Class Image_Dimension_Extractor.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

namespace Google\Web_Stories\AMP;

use AMP_Image_Dimension_Extractor;

/**
 * Image Dimension Extractor class.
 *
 * Class with static methods to extract image dimensions.
 *
 * This version avoids using the AMP__VERSION constant.
 *
 * @since 1.0.0
 */
class Image_Dimension_Extractor extends AMP_Image_Dimension_Extractor {
	/**
	 * Get default user agent.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public static function get_default_user_agent() {
		return 'web-stories-wp, v' . WEBSTORIES_VERSION . ', ' . home_url();
	}
}
