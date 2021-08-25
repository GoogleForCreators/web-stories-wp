<?php
/**
 * DependencyInjectedTestCase class.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

namespace Google\Web_Stories\Tests;

use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Infrastructure\ServiceContainer;
use Google\Web_Stories\Plugin;
use Google\Web_Stories\Services;

abstract class DependencyInjectedTestCase extends TestCase {

	/**
	 * Plugin instance to test with.
	 *
	 * @var Plugin
	 */
	protected $plugin;

	/**
	 * Service container instance to test with.
	 *
	 * @var ServiceContainer
	 */
	protected $container;

	/**
	 * Injector instance to test with.
	 *
	 * @var Injector
	 */
	protected $injector;

	/**
	 * Set up the service architecture before each test run.
	 */
	public function setUp() {
		parent::setUp();

		// We're intentionally avoiding the PluginFactory here as it uses a
		// static instance, because its whole point is to allow reuse across consumers.
		$this->plugin = new Plugin();
		$this->plugin->register();

		$this->container = $this->plugin->get_container();
		$this->injector  = $this->container->get( 'injector' );

		// The static Services helper has to be modified to use the same objects
		// as the ones that are injected into the tests.
		$this->set_private_property( Services::class, 'plugin', $this->plugin );
		$this->set_private_property( Services::class, 'container', $this->container );
		$this->set_private_property( Services::class, 'injector', $this->injector );
	}

	/**
	 * Clean up again after each test run.
	 */
	public function tearDown() {
		parent::tearDown();

		$this->set_private_property( Services::class, 'plugin', null );
		$this->set_private_property( Services::class, 'container', null );
		$this->set_private_property( Services::class, 'injector', null );

		// WordPress core fails to do this.
		$GLOBALS['wp_the_query'] = $GLOBALS['wp_query'];
		unset( $GLOBALS['current_screen'] );
	}
}
