<?php
/**
 * Interface SiteRemovalAware.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

namespace Google\Web_Stories\Infrastructure;

use WP_Site;

/**
 * Something that acts on site removal on Multisite.
 *
 * By tagging a service with this interface, the system will automatically hook
 * it up to the 'wp_validate_site_deletion' WordPress action.
 *
 * @since 1.11.0
 * @internal
 */
interface SiteRemovalAware {

	/**
	 * Act on site removal.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being removed.
	 * @return void
	 */
	public function on_site_removal( WP_Site $site );
}
