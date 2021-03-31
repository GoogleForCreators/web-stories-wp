<?php
/**
 * Class REST_API_Factory.
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

namespace Google\Web_Stories;

use Google\Web_Stories\REST_API\Embed_Controller;
use Google\Web_Stories\REST_API\Status_Check_Controller;
use Google\Web_Stories\REST_API\Link_Controller;
use Google\Web_Stories\REST_API\Stories_Autosaves_Controller;
use Google\Web_Stories\REST_API\Stories_Lock_Controller;
use Google\Web_Stories\REST_API\Stories_Media_Controller;
use Google\Web_Stories\REST_API\Stories_Settings_Controller;
use Google\Web_Stories\REST_API\Stories_Users_Controller;

/**
 * Class REST_API_Factory
 */
class REST_API_Factory extends Service_Base {
	/**
	 * Registers REST API routes.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function register() {
		// TODO refactor to be a little cleaner.

		$link_controller = new Link_Controller();
		$link_controller->register_routes();

		$status_check = new Status_Check_Controller();
		$status_check->register_routes();

		$embed_controller = new Embed_Controller();
		$embed_controller->register_routes();

		$templates_autosaves = new Stories_Autosaves_Controller( Template_Post_Type::POST_TYPE_SLUG );
		$templates_autosaves->register_routes();

		$stories_autosaves = new Stories_Autosaves_Controller( Story_Post_Type::POST_TYPE_SLUG );
		$stories_autosaves->register_routes();

		$templates_lock = new Stories_Lock_Controller( Template_Post_Type::POST_TYPE_SLUG );
		$templates_lock->register_routes();

		$stories_lock = new Stories_Lock_Controller( Story_Post_Type::POST_TYPE_SLUG );
		$stories_lock->register_routes();

		$stories_media = new Stories_Media_Controller( 'attachment' );
		$stories_media->register_routes();

		$stories_users = new Stories_Users_Controller();
		$stories_users->register_routes();

		$stories_settings = new Stories_Settings_Controller();
		$stories_settings->register_routes();
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action() {
		return 'rest_api_init';
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority() {
		return 100;
	}
}
