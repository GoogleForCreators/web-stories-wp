<?php
/**
 * Class Taxonomy_Base.
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

namespace Google\Web_Stories\Taxonomy;

use Google\Web_Stories\Infrastructure\PluginActivationAware;
use Google\Web_Stories\Infrastructure\PluginDeactivationAware;
use Google\Web_Stories\Infrastructure\SiteInitializationAware;
use Google\Web_Stories\Service_Base;
use WP_Site;

/**
 * Taxonomy_Base class
 *
 * @phpstan-type TaxonomyArgs array{
 *   labels?: string[],
 *   description?: string,
 *   public?: bool,
 *   publicly_queryable?: bool,
 *   hierarchical?: bool,
 *   show_ui?: bool,
 *   show_in_menu?: bool,
 *   show_in_nav_menus?: bool,
 *   show_in_rest?: bool,
 *   rest_base?: string,
 *   rest_namespace?: string,
 *   rest_controller_class?: string,
 *   show_tagcloud?: bool,
 *   show_in_quick_edit?: bool,
 *   show_admin_column?: bool,
 *   meta_box_cb?: bool|callable,
 *   meta_box_sanitize_cb?: callable,
 *   capabilities?: string[],
 *   rewrite?: bool|array{
 *     slug?: string,
 *     with_front?: bool,
 *     hierarchical?: bool,
 *     ep_mask?: int
 *   },
 *   query_var?: string|bool,
 *   update_count_callback?: callable,
 *   default_term?: string|array{
 *     name?: string,
 *     slug?: string,
 *     description?: string
 *   },
 *   sort?: bool,
 *   args?: array<string, mixed>,
 *   _builtin?: bool,
 * }
 */
abstract class Taxonomy_Base extends Service_Base implements PluginActivationAware, PluginDeactivationAware, SiteInitializationAware {

	public const DEFAULT_CAPABILITIES = [
		'manage_terms' => 'manage_terms_web-stories',
		'edit_terms'   => 'edit_terms_web-stories',
		'delete_terms' => 'delete_terms_web-stories',
		'assign_terms' => 'assign_terms_web-stories',
	];

	/**
	 * Default REST Namespace.
	 */
	public const REST_NAMESPACE = 'web-stories/v1';

	/**
	 * Taxonomy key, must not exceed 32 characters.
	 *
	 * @var string
	 */
	protected $taxonomy_slug;

	/**
	 * Object type or array of object types with which the taxonomy should be associated.
	 *
	 * @var string[]|string
	 */
	protected $taxonomy_post_type;

	/**
	 * Register taxonomy on register service.
	 *
	 * @since 1.12.0
	 */
	public function register(): void {
		$this->register_taxonomy();
	}

	/**
	 * Register taxonomy.
	 *
	 * @since 1.12.0
	 */
	public function register_taxonomy(): void {
		register_taxonomy( $this->taxonomy_slug, $this->taxonomy_post_type, $this->taxonomy_args() );
	}

	/**
	 * Unregister taxonomy.
	 *
	 * @since 1.12.0
	 */
	public function unregister_taxonomy(): void {
		unregister_taxonomy( $this->taxonomy_slug );
	}

	/**
	 * Taxonomy args.
	 *
	 * @since 1.12.0
	 *
	 * @return TaxonomyArgs Taxonomy args.
	 */
	abstract protected function taxonomy_args(): array;

	/**
	 * Act on site initialization.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_Site $site The site being initialized.
	 */
	public function on_site_initialization( WP_Site $site ): void {
		$this->register_taxonomy();
	}

	/**
	 * Act on plugin activation.
	 *
	 * @since 1.12.0
	 *
	 * @param bool $network_wide Whether the activation was done network-wide.
	 */
	public function on_plugin_activation( $network_wide ): void {
		$this->register_taxonomy();
	}

	/**
	 * Act on plugin deactivation.
	 *
	 * @since 1.12.0
	 *
	 * @param bool $network_wide Whether the deactivation was done network-wide.
	 */
	public function on_plugin_deactivation( $network_wide ): void {
		$this->unregister_taxonomy();
	}

	/**
	 * Get taxonomy slug.
	 *
	 * @since 1.12.0
	 */
	public function get_taxonomy_slug(): string {
		return $this->taxonomy_slug;
	}

}
