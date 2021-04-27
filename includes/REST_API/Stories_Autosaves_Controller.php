<?php
/**
 * Class Stories_Autosaves_Controller
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

namespace Google\Web_Stories\REST_API;

use Google\Web_Stories\Story_Post_Type;

/**
 * Stories_Autosaves_Controller class.
 *
 * Override the WP_REST_Autosaves_Controller class.
 */
class Stories_Autosaves_Controller extends Autosaves_Controller {
	/**
	 * Stories_Autosaves_Controller constructor.
	 */
	public function __construct() {
		parent::__construct( Story_Post_Type::POST_TYPE_SLUG );
	}
}
