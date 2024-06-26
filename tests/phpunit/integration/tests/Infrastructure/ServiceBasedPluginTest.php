<?php

declare(strict_types = 1);

namespace Google\Web_Stories\Tests\Integration\Infrastructure;

use Google\Web_Stories\Infrastructure\ServiceBasedPlugin;
use Google\Web_Stories\Infrastructure\ServiceContainer\SimpleServiceContainer;
use Google\Web_Stories\Tests\Integration\Fixture\DummyService;
use Google\Web_Stories\Tests\Integration\Fixture\DummyServiceBasedPlugin;
use Google\Web_Stories\Tests\Integration\Fixture\DummyServiceWithDelay;
use Google\Web_Stories\Tests\Integration\Fixture\DummyServiceWithRequirements;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Infrastructure\ServiceBasedPlugin
 */
final class ServiceBasedPluginTest extends TestCase {
	public function test_it_can_be_registered(): void {
		$plugin = $this->getMockBuilder( ServiceBasedPlugin::class )
			->onlyMethods( [ 'register_services' ] )
			->getMock();

		$plugin->expects( $this->once() )->method( 'register_services' );

		$plugin->register();
	}

	public function test_it_always_registers_an_injector_by_default(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( ServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->onlyMethods( [] )
			->getMock();

		$this->assertCount( 0, $container );

		$plugin->register();

		$this->assertCount( 1, $container );
		$this->assertTrue( $container->has( 'injector' ) );
	}

	public function test_it_registers_default_services(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->onlyMethods( [] )
			->getMock();

		$this->assertCount( 0, $container );

		$plugin->register();

		$this->assertCount( 3, $container );
		$this->assertTrue( $container->has( 'service_a' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );
	}

	public function test_it_allows_services_to_be_filtered(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->onlyMethods( [] )
			->getMock();

		add_filter(
			'services',
			static fn() => [ 'filtered_service' => DummyService::class ]
		);

		$this->assertFalse( $container->has( 'filtered_service' ) );

		$plugin->register();

		$this->assertCount( 2, $container );
		$this->assertTrue( $container->has( 'filtered_service' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'filtered_service' ) );
		$this->assertfalse( $container->has( 'service_a' ) );
		$this->assertfalse( $container->has( 'service_b' ) );
	}

	public function test_it_provides_default_services_for_filtering(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->onlyMethods( [] )
			->getMock();

		add_filter(
			'services',
			static fn( $services ) => array_merge(
				$services,
				[ 'filtered_service' => DummyService::class ]
			)
		);

		$this->assertFalse( $container->has( 'filtered_service' ) );

		$plugin->register();

		$this->assertCount( 4, $container );
		$this->assertTrue( $container->has( 'service_a' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );
		$this->assertTrue( $container->has( 'filtered_service' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'filtered_service' ) );
	}

	public function test_it_registers_service_with_requirements(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
						->enableOriginalConstructor()
						->setConstructorArgs( [ true, null, $container ] )
						->onlyMethods( [] )
						->getMock();

		$service_callback = static fn( $services ) => array_merge(
			$services,
			[ 'service_with_requirements' => DummyServiceWithRequirements::class ]
		);

		add_filter( 'services', $service_callback );

		$plugin->register();

		$this->assertCount( 4, $container );
		$this->assertTrue( $container->has( 'service_a' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );
		$this->assertTrue( $container->has( 'service_with_requirements' ) );
		$this->assertInstanceof( DummyServiceWithRequirements::class, $container->get( 'service_with_requirements' ) );
	}

	public function test_it_handles_delays_for_requirements(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
						->enableOriginalConstructor()
						->setConstructorArgs( [ true, null, $container ] )
						->onlyMethods( [] )
						->getMock();

		$service_callback = static fn( $services ) => array_merge(
			$services,
			[
				'service_a'                 => DummyServiceWithDelay::class,
				'service_with_requirements' => DummyServiceWithRequirements::class,
			]
		);

		add_filter( 'services', $service_callback );

		$plugin->register();

		$this->assertCount( 2, $container );
		$this->assertFalse( $container->has( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertFalse( $container->has( 'service_with_requirements' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );

		do_action( 'some_action' );

		$this->assertCount( 4, $container );
		$this->assertTrue( $container->has( 'service_a' ) );
		$this->assertInstanceof( DummyServiceWithDelay::class, $container->get( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );
		$this->assertTrue( $container->has( 'service_with_requirements' ) );
		$this->assertInstanceof( DummyServiceWithRequirements::class, $container->get( 'service_with_requirements' ) );
	}

	public function test_it_throws_an_exception_if_unrecognized_service_is_required(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
						->enableOriginalConstructor()
						->setConstructorArgs( [ true, null, $container ] )
						->onlyMethods( [] )
						->getMock();

		$service_callback = static fn() => [ 'service_with_requirements' => DummyServiceWithRequirements::class ];

		add_filter( 'services', $service_callback );

		$this->expectExceptionMessage( 'The service ID "service_a" is not recognized and cannot be retrieved.' );
		$plugin->register();
	}

	public function test_it_generates_identifiers_as_needed(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( ServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->onlyMethods( [] )
			->getMock();

		add_filter(
			'services',
			static fn() => [ DummyService::class ]
		);

		$plugin->register();

		$this->assertCount( 2, $container );
		$this->assertTrue( $container->has( 'dummy_service' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'dummy_service' ) );
	}

	public function test_it_skips_unknown_service_classes(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( ServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->onlyMethods( [] )
			->getMock();

		add_filter(
			'services',
			static fn() => [
				'unknown_class' => 'UnknownClass',
			]
		);

		$plugin->register();

		$this->assertCount( 1, $container );
		$this->assertFalse( $container->has( 'dummy_service' ) );
	}

	public function test_it_can_have_filtering_disabled(): void {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
			->setConstructorArgs( [ false, null, $container ] )
			->enableOriginalConstructor()
			->onlyMethods( [] )
			->getMock();

		add_filter(
			'services',
			static fn() => [ 'filtered_service' => DummyService::class ]
		);

		$plugin->register();

		$this->assertCount( 3, $container );
		$this->assertTrue( $container->has( 'service_a' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );
		$this->assertFalse( $container->has( 'filtered_service' ) );
	}
}
