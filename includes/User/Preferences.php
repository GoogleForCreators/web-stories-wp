<?php
/**
 * User Preferences class.
 *
 * Register user meta.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

namespace Google\Web_Stories\User;

use Google\Web_Stories\Infrastructure\HasMeta;
use Google\Web_Stories\Service_Base;

/**
 * User Preferences class.
 */
class Preferences extends Service_Base implements HasMeta {
	/**
	 * Name of the user meta key used for opt-in.
	 */
	public const OPTIN_META_KEY = 'web_stories_tracking_optin';

	/**
	 * Name of the user meta key used for onboarding.
	 */
	public const ONBOARDING_META_KEY = 'web_stories_onboarding';

	/**
	 * Name of the user meta key used for media optimization.
	 */
	public const MEDIA_OPTIMIZATION_META_KEY = 'web_stories_media_optimization';

	/**
	 * Initializes User_Preferences.
	 *
	 * Registers the setting in WordPress.
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
		$this->register_meta();
	}

	/**
	 * Register meta
	 *
	 * @since 1.15.0
	 */
	public function register_meta(): void {
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
	 * @since 1.4.0
	 *
	 * @param bool   $allowed Unused. Whether the user can add the object meta.
	 * @param string $meta_key Unused. The meta key.
	 * @param int    $user_id ID of the user being edited.
	 * @param int    $current_user_id The currently editing user's ID.
	 */
	public function can_edit_current_user( $allowed, $meta_key, $user_id, $current_user_id ): bool {
		return user_can( $current_user_id, 'edit_user', $user_id );
	}

	/**
	 * Returns the specific preference for a givern user.
	 *
	 * @since 1.12.0
	 *
	 * @param int    $user_id User ID.
	 * @param string $key Preference key.
	 * @return mixed User preference value.
	 */
	public function get_preference( $user_id, $key ) {
		return get_user_meta( $user_id, $key, true );
	}
}
