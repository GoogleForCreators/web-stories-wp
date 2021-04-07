<?php

namespace Google\Web_Stories\Tests\Infrastructure;

use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Infrastructure\ServiceBasedPlugin;
use Google\Web_Stories\Infrastructure\ServiceContainer;
use Google\Web_Stories\Infrastructure\ServiceContainer\SimpleServiceContainer;
use Google\Web_Stories\Tests\Fixture\DummyService;
use Google\Web_Stories\Tests\Fixture\DummyServiceBasedPlugin;
use WP_UnitTestCase;

final class ServiceBasedPluginTest extends WP_UnitTestCase {

	public function test_it_can_be_instantiated() {
		$plugin = $this->createMock( ServiceBasedPlugin::class );

		$this->assertInstanceOf( ServiceBasedPlugin::class, $plugin );
	}

	public function test_it_can_return_its_container() {
		$plugin = $this->getMockBuilder( ServiceBasedPlugin::class )
			->setMethodsExcept( [ 'get_container' ] )
			->enableOriginalConstructor()
			->getMock();

		$container = $plugin->get_container();

		$this->assertInstanceOf( ServiceContainer::class, $container );
	}

	public function test_it_can_be_registered() {
		$plugin = $this->getMockBuilder( ServiceBasedPlugin::class )
			->setMethodsExcept( [ 'register' ] )
			->getMock();

		$plugin->expects( $this->once() )->method( 'register_services' );

		$plugin->register();
	}

	public function test_it_always_registers_an_injector_by_default() {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( ServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->setMethodsExcept( [ 'register', 'register_services' ] )
			->getMock();

		$this->assertEquals( 0, count( $container ) );

		$plugin->register();

		$this->assertEquals( 1, count( $container ) );
		$this->assertTrue( $container->has( 'injector' ) );
		$this->assertInstanceof( Injector::class, $container->get( 'injector' ) );
	}

	public function test_it_registers_default_services() {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->setMethods()
			->setMethodsExcept(
				[
					'register',
					'register_services',
					'get_service_classes',
				]
			)
			->getMock();

		$this->assertEquals( 0, count( $container ) );

		$plugin->register();

		$this->assertEquals( 3, count( $container ) );
		$this->assertTrue( $container->has( 'service_a' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );
	}

	public function test_it_allows_services_to_be_filtered() {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->setMethodsExcept(
				[
					'register',
					'register_services',
					'get_service_classes',
				]
			)
			->getMock();

		add_filter(
			'services',
			static function () {
				return [ 'filtered_service' => DummyService::class ];
			}
		);

		$this->assertFalse( $container->has( 'filtered_service' ) );

		$plugin->register();

		$this->assertEquals( 2, count( $container ) );
		$this->assertTrue( $container->has( 'filtered_service' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'filtered_service' ) );
		$this->assertfalse( $container->has( 'service_a' ) );
		$this->assertfalse( $container->has( 'service_b' ) );
	}

	public function test_it_provides_default_services_for_filtering() {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->setMethodsExcept(
				[
					'register',
					'register_services',
					'get_service_classes',
				]
			)
			->getMock();

		add_filter(
			'services',
			static function ( $services ) {
				return array_merge(
					$services,
					[ 'filtered_service' => DummyService::class ]
				);
			}
		);

		$this->assertFalse( $container->has( 'filtered_service' ) );

		$plugin->register();

		$this->assertEquals( 4, count( $container ) );
		$this->assertTrue( $container->has( 'service_a' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );
		$this->assertTrue( $container->has( 'filtered_service' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'filtered_service' ) );
	}

	public function test_it_generates_identifiers_as_needed() {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( ServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->setMethodsExcept( [ 'register', 'register_services' ] )
			->getMock();

		add_filter(
			'services',
			static function () {
				return [ DummyService::class ];
			}
		);

		$plugin->register();

		$this->assertEquals( 2, count( $container ) );
		$this->assertTrue( $container->has( 'dummy_service' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'dummy_service' ) );
	}

	public function test_it_skips_unknown_service_classes() {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( ServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->setMethodsExcept( [ 'register', 'register_services' ] )
			->getMock();

		add_filter(
			'services',
			static function () {
				return [
					'unknown_class' => 'UnknownClass',
				];
			}
		);

		$plugin->register();

		$this->assertEquals( 1, count( $container ) );
		$this->assertFalse( $container->has( 'dummy_service' ) );
	}

	public function test_it_falls_back_to_defaults_on_broken_filtering() {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
			->enableOriginalConstructor()
			->setConstructorArgs( [ true, null, $container ] )
			->setMethodsExcept(
				[
					'register',
					'register_services',
					'get_service_classes',
				]
			)
			->getMock();

		add_filter(
			'services',
			static function () {
				return null;
			}
		);

		$plugin->register();

		$this->assertEquals( 3, count( $container ) );
		$this->assertTrue( $container->has( 'service_a' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );
	}

	public function test_it_can_have_filtering_disabled() {
		$container = new SimpleServiceContainer();
		$plugin    = $this->getMockBuilder( DummyServiceBasedPlugin::class )
			->setConstructorArgs( [ false, null, $container ] )
			->enableOriginalConstructor()
			->setMethodsExcept(
				[
					'register',
					'register_services',
					'get_service_classes',
				]
			)
			->getMock();

		add_filter(
			'services',
			static function () {
				return [ 'filtered_service' => DummyService::class ];
			}
		);

		$plugin->register();

		$this->assertEquals( 3, count( $container ) );
		$this->assertTrue( $container->has( 'service_a' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_a' ) );
		$this->assertTrue( $container->has( 'service_b' ) );
		$this->assertInstanceof( DummyService::class, $container->get( 'service_b' ) );
		$this->assertFalse( $container->has( 'filtered_service' ) );
	}
}
