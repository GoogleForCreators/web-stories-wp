<?php
/**
 * DependencyInjectedTestCase class.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

namespace Google\Web_Stories\Tests\Integration;

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
	public function set_up() {
		parent::set_up();

		// Needed because the block will exist already after hooking up the plugin
		// on plugins_loaded. This avoids _doing_it_wrong messages
		// due to registering the plugin (and thus the block) again.
		// But only du so when the block is actually registered to avoid another
		// _doing_it_wrong message being triggered.
		// TODO: Figure out a better way.
		if ( \WP_Block_Type_Registry::get_instance()->is_registered( 'web-stories/embed' ) ) {
			unregister_block_type( 'web-stories/embed' );
		}

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
	public function tear_down() {
		$this->set_private_property( Services::class, 'plugin', null );
		$this->set_private_property( Services::class, 'container', null );
		$this->set_private_property( Services::class, 'injector', null );

		parent::tear_down();
	}
}
