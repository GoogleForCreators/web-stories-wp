<?php
/**
 * Class Capabilities
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

declare(strict_types = 1);

namespace Google\Web_Stories\User;

use Google\Web_Stories\Infrastructure\HasRequirements;
use Google\Web_Stories\Infrastructure\PluginActivationAware;
use Google\Web_Stories\Infrastructure\PluginUninstallAware;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Infrastructure\SiteInitializationAware;
use Google\Web_Stories\Infrastructure\SiteRemovalAware;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Taxonomy\Taxonomy_Base;
use WP_Role;
use WP_Site;

/**
 * Class Capabilities
 */
class Capabilities implements Service, PluginActivationAware, SiteInitializationAware, SiteRemovalAware, PluginUninstallAware, HasRequirements {
	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private Story_Post_Type $story_post_type;

	/**
	 * Font_Post_Type constructor.
	 *
	 * @since 1.16.0
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because the story post type needs to be registered first.
	 *
	 * @since 1.29.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'story_post_type' ];
	}

	/**
	 * Act on plugin activation.
	 *
	 * @since 1.6.0
	 *
	 * @param bool $network_wide Whether the activation was done network-wide.
	 */
	public function on_plugin_activation( bool $network_wide ): void {
		$this->add_caps_to_roles();
	}

	/**
	 * Act on site initialization.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being initialized.
	 */
	public function on_site_initialization( WP_Site $site ): void {
		$this->add_caps_to_roles();
	}

	/**
	 * Act on site removal.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being removed.
	 */
	public function on_site_removal( WP_Site $site ): void {
		$this->remove_caps_from_roles();
	}

	/**
	 * Act on plugin uninstall.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
		$this->remove_caps_from_roles();
	}

	/**
	 * Adds story capabilities to default user roles.
	 *
	 * This gives WordPress site owners more granular control over story management,
	 * as they can customize this to their liking.
	 *
	 * @since 1.0.0
	 */
	public function add_caps_to_roles(): void {
		$all_capabilities_raw = $this->get_all_capabilities();
		$all_capabilities     = array_values( $all_capabilities_raw );

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
			$author->add_cap( $all_capabilities_raw['edit_posts'] );
			$author->add_cap( $all_capabilities_raw['edit_published_posts'] );
			$author->add_cap( $all_capabilities_raw['delete_posts'] );
			$author->add_cap( $all_capabilities_raw['delete_published_posts'] );
			$author->add_cap( $all_capabilities_raw['publish_posts'] );
			$author->add_cap( $all_capabilities_raw['assign_terms'] );
		}

		if ( $contributor instanceof WP_Role ) {
			$contributor->add_cap( $all_capabilities_raw['edit_posts'] );
			$contributor->add_cap( $all_capabilities_raw['delete_posts'] );
			$contributor->add_cap( $all_capabilities_raw['assign_terms'] );
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
	 */
	public function remove_caps_from_roles(): void {
		$all_capabilities_raw = $this->get_all_capabilities();
		$all_capabilities     = array_values( $all_capabilities_raw );
		$all_capabilities     = array_filter(
			$all_capabilities,
			static fn( $value ) => 'read' !== $value
		);
		$all_roles            = wp_roles();
		$roles                = array_values( (array) $all_roles->role_objects );
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

	/**
	 * Get a array of capability for post types and taxonomies.
	 *
	 * @since 1.12.0
	 *
	 * @return array<string,string> Capabilities.
	 */
	protected function get_all_capabilities(): array {
		return array_merge(
			Taxonomy_Base::DEFAULT_CAPABILITIES,
			$this->story_post_type->get_caps(),
		);
	}
}
