<?php
/**
 * Interface SiteInitializationAware.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

declare(strict_types = 1);

namespace Google\Web_Stories\Infrastructure;

use WP_Site;

/**
 * Something that acts on site creation on Multisite.
 *
 * By tagging a service with this interface, the system will automatically hook
 * it up to the 'wp_initialize_site' WordPress action.
 *
 * @internal
 *
 * @since 1.11.0
 */
interface SiteInitializationAware {

	/**
	 * Act on site initialization.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being initialized.
	 */
	public function on_site_initialization( WP_Site $site ): void;
}
