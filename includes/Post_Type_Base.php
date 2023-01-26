<?php
/**
 * Class Post_Type_Base
 *
 * Base class for registering and handling post types.
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

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\PluginActivationAware;
use Google\Web_Stories\Infrastructure\PluginDeactivationAware;
use Google\Web_Stories\Infrastructure\PluginUninstallAware;
use Google\Web_Stories\Infrastructure\SiteInitializationAware;
use WP_Error;
use WP_Post_Type;
use WP_REST_Controller;
use WP_REST_Posts_Controller;
use WP_Rewrite;
use WP_Site;

/**
 * Class Post_Type_Base.
 *
 * @phpstan-type PostTypeArgs array{
 *   label?: string,
 *   labels?: string[],
 *   description?: string,
 *   public?: bool,
 *   hierarchical?: bool,
 *   exclude_from_search?: bool,
 *   publicly_queryable?: bool,
 *   show_ui?: bool,
 *   show_in_menu?: bool|string,
 *   show_in_nav_menus?: bool,
 *   show_in_admin_bar?: bool,
 *   show_in_rest?: bool,
 *   rest_base?: string,
 *   rest_namespace?: string,
 *   rest_controller_class?: string,
 *   menu_position?: int,
 *   menu_icon?: string,
 *   capability_type?: string|array{0: string, 1: string},
 *   capabilities?: array<string, string>,
 *   map_meta_cap?: bool,
 *   supports?: array<int, string|array<string, mixed>>,
 *   register_meta_box_cb?: callable,
 *   taxonomies?: string[],
 *   has_archive?: bool|string,
 *   rewrite?: bool|array{
 *     slug?: string,
 *     with_front?: bool,
 *     feeds?: bool,
 *     pages?: bool,
 *     ep_mask?: int
 *   },
 *   query_var?: string|bool,
 *   can_export?: bool,
 *   delete_with_user?: bool,
 *   template?: array<int, array{
 *     name: string,
 *     attributes?: array<string, mixed>
 *   }>,
 *   template_lock?: string|false,
 *   _builtin?: bool,
 *   _edit_link?: string
 * }
 */
abstract class Post_Type_Base extends Service_Base implements PluginActivationAware, PluginDeactivationAware, SiteInitializationAware, PluginUninstallAware {

	/**
	 * Default REST Namespace.
	 */
	public const REST_NAMESPACE = 'web-stories/v1';

	/**
	 * Registers the post type.
	 *
	 * @since 1.14.0
	 */
	public function register(): void {
		$this->register_post_type();
	}

	/**
	 * Register post type.
	 *
	 * @since 1.14.0
	 *
	 * @return WP_Post_Type|WP_Error
	 */
	public function register_post_type() {
		return register_post_type( $this->get_slug(), $this->get_args() );
	}

	/**
	 * Unregister post type.
	 *
	 * @since 1.14.0
	 */
	public function unregister_post_type(): void {
		unregister_post_type( $this->get_slug() );
	}

	/**
	 * Act on site initialization.
	 *
	 * @since 1.14.0
	 *
	 * @param WP_Site $site The site being initialized.
	 */
	public function on_site_initialization( WP_Site $site ): void {
		$this->register_post_type();
	}

	/**
	 * Act on plugin activation.
	 *
	 * @since 1.14.0
	 *
	 * @param bool $network_wide Whether the activation was done network-wide.
	 */
	public function on_plugin_activation( bool $network_wide ): void {
		$this->register_post_type();
	}

	/**
	 * Act on plugin deactivation.
	 *
	 * @since 1.14.0
	 *
	 * @param bool $network_wide Whether the deactivation was done network-wide.
	 */
	public function on_plugin_deactivation( bool $network_wide ): void {
		$this->unregister_post_type();
	}

	/**
	 * Post type slug.
	 *
	 * @since 1.14.0
	 */
	abstract public function get_slug(): string;

	/**
	 * Get REST base name based on the post type.
	 *
	 * @since 1.14.0
	 *
	 * @return string REST base.
	 */
	public function get_rest_base(): string {
		$post_type_object = $this->get_object();
		$rest_base        = $this->get_slug();
		if ( $post_type_object instanceof WP_Post_Type ) {
			$rest_base = ! empty( $post_type_object->rest_base ) && \is_string( $post_type_object->rest_base ) ?
				$post_type_object->rest_base :
				$post_type_object->name;
		}

		return (string) $rest_base;
	}

	/**
	 * Get REST namespace on the post type.
	 *
	 * @since 1.14.0
	 *
	 * @return string REST base.
	 */
	public function get_rest_namespace(): string {
		$post_type_object = $this->get_object();
		$rest_namespace   = isset( $post_type_object, $post_type_object->rest_namespace ) && \is_string( $post_type_object->rest_namespace ) ?
			$post_type_object->rest_namespace :
			self::REST_NAMESPACE;

		return (string) $rest_namespace;
	}

	/**
	 * Get REST url for post type.
	 *
	 * @since 1.14.0
	 *
	 * @return string REST base.
	 */
	public function get_rest_url(): string {
		return rest_get_route_for_post_type_items( $this->get_slug() );
	}

	/**
	 * Returns all capabilities for the post type.
	 *
	 * @since 1.29.0
	 *
	 * @return string[] The post type capabilities.
	 */
	public function get_caps(): array {
		$post_type_obj = $this->get_object();

		if ( ! $post_type_obj instanceof WP_Post_Type ) {
			return [];
		}

		return (array) $post_type_obj->cap;
	}

	/**
	 * Determines whether the current user has a specific capability for this post type.
	 *
	 * @since 1.14.0
	 *
	 * @param string $cap Capability name.
	 * @return bool Whether the user has the capability.
	 */
	public function has_cap( string $cap ): bool {
		$capability_name = $this->get_cap_name( $cap );
		$capability      = false;
		if ( $capability_name ) {
			$capability = current_user_can( $capability_name );
		}

		return $capability;
	}

	/**
	 * Returns a specific post type capability name.
	 *
	 * @since 1.14.0
	 *
	 * @param string $cap Capability name.
	 * @return string|false Capability name if found, false otherwise.
	 */
	public function get_cap_name( string $cap ) {
		$post_type_obj   = $this->get_object();
		$capability_name = false;

		if ( ! $post_type_obj instanceof WP_Post_Type ) {
			return $capability_name;
		}

		if ( property_exists( $post_type_obj->cap, $cap ) ) {
			$capability_name = $post_type_obj->cap->$cap;
		}

		return $capability_name;
	}

	/**
	 * Get Label on the post type slug and name.
	 *
	 * @since 1.14.0
	 *
	 * @param string $label Label name.
	 */
	public function get_label( string $label ): string {
		$post_type_obj = $this->get_object();
		$name          = '';

		if ( ! $post_type_obj instanceof WP_Post_Type ) {
			return $name;
		}

		if ( property_exists( $post_type_obj->labels, $label ) ) {
			$name = $post_type_obj->labels->$label;
		}

		return $name;
	}

	/**
	 * Get rest controller on the post type slug.
	 *
	 * @since 1.14.0
	 *
	 * @return WP_REST_Posts_Controller|WP_REST_Controller
	 */
	public function get_parent_controller(): WP_REST_Controller {
		$post_type_obj     = $this->get_object();
		$parent_controller = null;

		if ( $post_type_obj instanceof WP_Post_Type ) {
			$parent_controller = $post_type_obj->get_rest_controller();
		}

		if ( ! $parent_controller ) {
			$parent_controller = new WP_REST_Posts_Controller( $this->get_slug() );
		}

		return $parent_controller;
	}

	/**
	 * Retrieves the permalink for a post type archive.
	 *
	 * Identical to {@see get_post_type_archive_link()}, but also returns a URL
	 * if the archive page has been disabled.
	 *
	 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
	 *
	 * @since 1.14.0
	 *
	 * @global WP_Rewrite $wp_rewrite WordPress rewrite component.
	 *
	 * @param  bool $ignore_has_archive Ignore 'has_archive' value to get default permalink.
	 * @return string|false The post type archive permalink. False if the post type does not exist.
	 */
	public function get_archive_link( bool $ignore_has_archive = false ) {
		global $wp_rewrite;

		$post_type_obj = $this->get_object();
		if ( ! $post_type_obj instanceof WP_Post_Type ) {
			return false;
		}

		if ( get_option( 'permalink_structure' ) && \is_array( $post_type_obj->rewrite ) ) {
			$struct = true === $post_type_obj->has_archive || $ignore_has_archive ? $post_type_obj->rewrite['slug'] : $post_type_obj->has_archive;
			if ( $post_type_obj->rewrite['with_front'] ) {
				$struct = $wp_rewrite->front . $struct;
			} else {
				$struct = $wp_rewrite->root . $struct;
			}
			$link = home_url( user_trailingslashit( $struct, 'post_type_archive' ) );
		} else {
			$link = home_url( '?post_type=' . $this->get_slug() );
		}

		/** This filter is documented in wp-includes/link-template.php */
		return apply_filters( 'post_type_archive_link', $link, $this->get_slug() );
	}

	/**
	 * Act on plugin uninstall.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
        // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.get_posts_get_posts -- False positive.
		$cpt_posts = get_posts(
			[
				'fields'           => 'ids',
				'suppress_filters' => false,
				'post_status'      => 'any',
				'post_type'        => $this->get_slug(),
				'posts_per_page'   => -1,
			]
		);

		foreach ( $cpt_posts as $post_id ) {
			wp_delete_post( (int) $post_id, true );
		}
	}

	/**
	 * Post type args.
	 *
	 * @since 1.14.0
	 *
	 * @return array<string, mixed> Post type args.
	 *
	 * @phpstan-return PostTypeArgs
	 */
	abstract protected function get_args(): array;

	/**
	 * Get post type object.
	 *
	 * @since 1.14.0
	 */
	protected function get_object(): ?WP_Post_Type {
		return get_post_type_object( $this->get_slug() );
	}
}
