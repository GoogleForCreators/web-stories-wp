<?php
/**
 * TestCase class.
 *
 * Basic test case for use with a WP Integration test test suite.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

namespace Google\Web_Stories\Tests\Integration;

use Google\Web_Stories\Tests\Shared\Private_Access;
use Yoast\WPTestUtils\WPIntegration\TestCase as PolyfilledTestCase;

/**
 * Class TestCase
 */
abstract class TestCase extends PolyfilledTestCase {
	use Private_Access;

	/**
	 * Clean up again after each test run.
	 */
	public function tear_down(): void {
		// WordPress core fails to do this.
		$GLOBALS['wp_the_query'] = $GLOBALS['wp_query'];

		// WordPress core fails to do this.
		// current_screen reset was only added in 5.9+, see https://core.trac.wordpress.org/ticket/53431.
		unset(
			$GLOBALS['current_screen'],
			$GLOBALS['show_admin_bar'],
			$GLOBALS['wp_meta_boxes'],
			$GLOBALS['hook_suffix'],
			$GLOBALS['menu'],
			$GLOBALS['submenu'],
			$GLOBALS['_wp_real_parent_file'],
			$GLOBALS['_wp_submenu_nopriv'],
			$GLOBALS['_registered_pages'],
			$GLOBALS['_parent_pages'],
			$_SERVER['HTTPS']
		);

		$this->set_permalink_structure( '' );

		$_SERVER['REQUEST_URI'] = '';

		parent::tear_down();
	}
}
