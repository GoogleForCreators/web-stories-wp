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

use Yoast\WPTestUtils\WPIntegration\TestCase as PolyfilledTestCase;

/**
 * Class TestCase
 *
 * @package Google\Web_Stories\Tests
 */
abstract class TestCase extends PolyfilledTestCase {
	use Private_Access;
}
