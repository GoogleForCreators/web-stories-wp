<?php
/**
 * User Preferences class.
 *
 * Register user meta.
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

namespace Google\Web_Stories;

/**
 * User Preferences class.
 */
class User_Preferences extends Service {
	/**
	 * Name of the user meta key used for opt-in.
	 *
	 * @var string
	 */
	const OPTIN_META_KEY = 'web_stories_tracking_optin';

	/**
	 * Name of the user meta key used for onboarding.
	 *
	 * @var string
	 */
	const ONBOARDING_META_KEY = 'web_stories_onboarding';

	/**
	 * Name of the user meta key used for media optimization.
	 *
	 * @var string
	 */
	const MEDIA_OPTIMIZATION_META_KEY = 'web_stories_media_optimization';

	/**
	 * Initializes User_Preferences.
	 *
	 * Registers the setting in WordPress.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register() {
		register_meta(
			'user',
			static::OPTIN_META_KEY,
			[
				'type'              => 'boolean',
				'sanitize_callback' => 'rest_sanitize_boolean',
				'default'           => false,
				'show_in_rest'      => true,
				'auth_callback'     => [ $this, 'can_edit_current_user' ],
				'single'            => true,
			]
		);

		register_meta(
			'user',
			static::MEDIA_OPTIMIZATION_META_KEY,
			[
				'type'              => 'boolean',
				'sanitize_callback' => 'rest_sanitize_boolean',
				'default'           => true,
				'show_in_rest'      => true,
				'auth_callback'     => [ $this, 'can_edit_current_user' ],
				'single'            => true,
			]
		);

		register_meta(
			'user',
			static::ONBOARDING_META_KEY,
			[
				'type'          => 'object',
				'default'       => [],
				'show_in_rest'  => [
					'schema' => [
						'properties'           => [],
						'additionalProperties' => true,
					],
				],
				'auth_callback' => [ $this, 'can_edit_current_user' ],
				'single'        => true,
			]
		);
	}

	/**
	 * Auth callback.
	 *
	 * @return bool
	 */
	public function can_edit_current_user() {
		return current_user_can( 'edit_user', get_current_user_id() );
	}
}
