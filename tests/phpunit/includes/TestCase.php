<?php
/**
 * TestCase class.
 *
 * Basic test case for use with a WP Integration test test suite.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

namespace Google\Web_Stories\Tests;

use Google\Web_Stories\Services;
use Yoast\WPTestUtils\WPIntegration\TestCase as PolyfilledTestCase;

/**
 * Class TestCase
 *
 * @package Google\Web_Stories\Tests
 */
abstract class TestCase extends PolyfilledTestCase {
	use Private_Access;

	/**
	 * Clean up again after each test run.
	 */
	public function tearDown() {
		// WordPress core fails to do this.
		$GLOBALS['wp_the_query'] = $GLOBALS['wp_query'];

		// Only added in 5.9+, see https://core.trac.wordpress.org/ticket/53431.
		unset( $GLOBALS['current_screen'] );

		// WordPress core fails to do this.
		unset( $GLOBALS['show_admin_bar'], $GLOBALS['wp_meta_boxes'], $GLOBALS['hook_suffix'], $_SERVER['HTTPS'], $_GET );

		$_SERVER['REQUEST_URI'] = '';

		parent::tearDown();
	}
}
