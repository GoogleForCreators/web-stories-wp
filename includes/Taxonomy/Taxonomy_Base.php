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
	 * @var array|string
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
	 * @return array
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
