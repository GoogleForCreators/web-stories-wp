<?php
/**
 * Interface SiteRemovalAware.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

namespace Google\Web_Stories\Infrastructure;

use WP_Site;

/**
 * Something that acts on site removal on Multisite.
 *
 * By tagging a service with this interface, the system will automatically hook
 * it up to the 'wp_validate_site_deletion' WordPress action.
 *
 * @internal
 *
 * @since 1.11.0
 */
interface SiteRemovalAware {

	/**
	 * Act on site removal.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being removed.
	 */
	public function on_site_removal( WP_Site $site ): void;
}
