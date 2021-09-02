<?php
/**
 * Class Capabilities
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

namespace Google\Web_Stories\User;

use Google\Web_Stories\Infrastructure\PluginActivationAware;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Infrastructure\SiteInitializationAware;
use Google\Web_Stories\Infrastructure\SiteRemovalAware;
use Google\Web_Stories\Story_Post_Type;
use WP_Role;
use WP_Site;

/**
 * Class Capabilities
 *
 * @package Google\Web_Stories\User
 */
class Capabilities implements Service, PluginActivationAware, SiteInitializationAware, SiteRemovalAware {
	/**
	 * Act on plugin activation.
	 *
	 * @since 1.6.0
	 *
	 * @param bool $network_wide Whether the activation was done network-wide.
	 * @return void
	 */
	public function on_plugin_activation( $network_wide ) {
		$this->add_caps_to_roles();
	}

	/**
	 * Act on site initialization.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being initialized.
	 * @return void
	 */
	public function on_site_initialization( WP_Site $site ) {
		$this->add_caps_to_roles();
	}

	/**
	 * Act on site removal.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being removed.
	 * @return void
	 */
	public function on_site_removal( WP_Site $site ) {
		$this->remove_caps_from_roles();
	}

	/**
	 * Adds story capabilities to default user roles.
	 *
	 * This gives WordPress site owners more granular control over story management,
	 * as they can customize this to their liking.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function add_caps_to_roles() {
		$post_type_object = get_post_type_object( Story_Post_Type::POST_TYPE_SLUG );

		if ( ! $post_type_object ) {
			return;
		}

		$all_capabilities = array_values( (array) $post_type_object->cap );

		$administrator = get_role( 'administrator' );
		$editor        = get_role( 'editor' );
		$author        = get_role( 'author' );
		$contributor   = get_role( 'contributor' );

		if ( $administrator instanceof WP_Role ) {
			foreach ( $all_capabilities as $cap ) {
				$administrator->add_cap( $cap );
			}
		}

		if ( $editor instanceof WP_Role ) {
			foreach ( $all_capabilities as $cap ) {
				$editor->add_cap( $cap );
			}
		}

		if ( $author instanceof WP_Role ) {
			$author->add_cap( 'edit_web-stories' );
			$author->add_cap( 'edit_published_web-stories' );
			$author->add_cap( 'delete_web-stories' );
			$author->add_cap( 'delete_published_web-stories' );
			$author->add_cap( 'publish_web-stories' );
		}

		if ( $contributor instanceof WP_Role ) {
			$contributor->add_cap( 'edit_web-stories' );
			$contributor->add_cap( 'delete_web-stories' );
		}

		/**
		 * Fires when adding the custom capabilities to existing roles.
		 *
		 * Can be used to add the capabilities to other, custom roles.
		 *
		 * @since 1.0.0
		 *
		 * @param array $all_capabilities List of all post type capabilities, for reference.
		 */
		do_action( 'web_stories_add_capabilities', $all_capabilities );
	}

	/**
	 * Removes story capabilities from all user roles.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function remove_caps_from_roles() {
		$post_type_object = get_post_type_object( Story_Post_Type::POST_TYPE_SLUG );

		if ( ! $post_type_object ) {
			return;
		}

		$all_capabilities = array_values( (array) $post_type_object->cap );
		$all_capabilities = array_filter(
			$all_capabilities,
			static function ( $value ) {
				return 'read' !== $value;
			}
		);
		$all_roles        = wp_roles();
		$roles            = array_values( (array) $all_roles->role_objects );
		foreach ( $roles as $role ) {
			if ( $role instanceof WP_Role ) {
				foreach ( $all_capabilities as $cap ) {
					$role->remove_cap( $cap );
				}
			}
		}

		/**
		 * Fires when removing the custom capabilities from existing roles.
		 *
		 * Can be used to remove the capabilities from other, custom roles.
		 *
		 * @since 1.0.0
		 *
		 * @param array $all_capabilities List of all post type capabilities, for reference.
		 */
		do_action( 'web_stories_remove_capabilities', $all_capabilities );
	}
}
