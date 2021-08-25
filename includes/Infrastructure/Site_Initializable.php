<?php
/**
 * Interface Site_Initializable.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

namespace Google\Web_Stories\Infrastructure;

use WP_Site;

/**
 * Something that acts on site creation on Multisite.
 *
 * By tagging a service with this interface, the system will automatically hook
 * it up to the 'wp_initialize_site' WordPress action.
 *
 * @since 1.11.0
 * @internal
 */
interface Site_Initializable {

	/**
	 * Initialize the service on the new site.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being initialized.
	 * @return void
	 */
	public function initialize_site( $site );
}
