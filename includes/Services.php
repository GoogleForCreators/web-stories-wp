<?php
/**
 * Class Services.
 */

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Infrastructure\ServiceContainer;

/**
 * Convenience class to get easy access to the service container.
 *
 * Using this should always be the last resort.
 * Always prefer to use constructor injection instead.
 */
final class Services {

	/**
	 * Plugin object instance.
	 *
	 * @var Plugin
	 */
	private static $plugin;

	/**
	 * Service container object instance.
	 *
	 * @var ServiceContainer<Service>
	 */
	private static $container;

	/**
	 * Dependency injector object instance.
	 *
	 * @var Injector|Service
	 */
	private static $injector;

	/**
	 * Get a particular service out of the service container.
	 *
	 * @since 1.6.0
	 *
	 * @param string $service Service ID to retrieve.
	 */
	public static function get( string $service ): Service {
		return self::get_container()->get( $service );
	}

	/**
	 * Check if a particular service has been registered in the service container.
	 *
	 * @since 1.6.0
	 *
	 * @param string $service Service ID to retrieve.
	 */
	public static function has( string $service ): bool {
		return self::get_container()->has( $service );
	}

	/**
	 * Get an instance of the plugin.
	 *
	 * @since 1.6.0
	 *
	 * @return Plugin Plugin object instance.
	 */
	public static function get_plugin(): Plugin {
		if ( null === self::$plugin ) {
			self::$plugin = PluginFactory::create();
		}

		return self::$plugin;
	}

	/**
	 * Get an instance of the service container.
	 *
	 * @since 1.6.0
	 *
	 * @return ServiceContainer<Service> Service container object instance.
	 */
	public static function get_container(): ServiceContainer {
		if ( null === self::$container ) {
			self::$container = self::get_plugin()->get_container();
		}

		return self::$container;
	}

	/**
	 * Get an instance of the dependency injector.
	 *
	 * @since 1.6.0
	 *
	 * @return Injector|Service Dependency injector object instance.
	 */
	public static function get_injector() {
		if ( null === self::$injector ) {
			self::$injector = self::get_container()->get( 'injector' );
		}

		return self::$injector;
	}
}
