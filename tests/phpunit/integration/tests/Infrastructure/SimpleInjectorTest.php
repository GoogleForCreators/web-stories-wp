<?php

declare(strict_types = 1);

namespace Google\Web_Stories\Tests\Integration\Infrastructure;

use Google\Web_Stories\Exception\FailedToMakeInstance;
use Google\Web_Stories\Infrastructure\Injector\SimpleInjector;
use Google\Web_Stories\Tests\Integration\Fixture;
use Google\Web_Stories\Tests\Integration\TestCase;
use stdClass;

final class SimpleInjectorTest extends TestCase {
	public function test_it_can_instantiate_a_concrete_class(): void {
		$object = ( new SimpleInjector() )
			->make( Fixture\DummyClass::class );

		$this->assertInstanceOf( Fixture\DummyClass::class, $object );
	}

	public function test_it_can_autowire_a_class_with_a_dependency(): void {
		$object = ( new SimpleInjector() )
			->make( Fixture\DummyClassWithDependency::class );

		$this->assertInstanceOf( Fixture\DummyClassWithDependency::class, $object );
	}

	public function test_it_can_instantiate_a_bound_interface(): void {
		$injector = ( new SimpleInjector() )
			->bind(
				Fixture\DummyInterface::class,
				Fixture\DummyClassWithDependency::class
			);
		$object   = $injector->make( Fixture\DummyInterface::class );

		$this->assertInstanceOf( Fixture\DummyClassWithDependency::class, $object );
	}

	public function test_it_returns_separate_instances_by_default(): void {
		$injector = new SimpleInjector();
		$object_a = $injector->make( Fixture\DummyClass::class );
		$object_b = $injector->make( Fixture\DummyClass::class );

		$this->assertNotSame( $object_a, $object_b );
	}

	public function test_it_returns_same_instances_if_shared(): void {
		$injector = ( new SimpleInjector() )
			->share( Fixture\DummyClass::class );
		$object_a = $injector->make( Fixture\DummyClass::class );
		$object_b = $injector->make( Fixture\DummyClass::class );

		$this->assertSame( $object_a, $object_b );
	}

	public function test_it_can_instantiate_a_class_with_named_arguments(): void {
		$object = ( new SimpleInjector() )
			->make(
				Fixture\DummyClassWithNamedArguments::class,
				[
					'argument_a' => 42,
					'argument_b' => 'Mr Alderson',
				]
			);

		$this->assertInstanceOf( Fixture\DummyClassWithNamedArguments::class, $object );
		$this->assertEquals( 42, $object->get_argument_a() );
		$this->assertEquals( 'Mr Alderson', $object->get_argument_b() );
	}

	public function test_it_allows_for_skipping_named_arguments_with_default_values(): void {
		$object = ( new SimpleInjector() )
			->make(
				Fixture\DummyClassWithNamedArguments::class,
				[ 'argument_a' => 42 ]
			);

		$this->assertInstanceOf( Fixture\DummyClassWithNamedArguments::class, $object );
		$this->assertEquals( 42, $object->get_argument_a() );
		$this->assertEquals( 'Mr Meeseeks', $object->get_argument_b() );
	}

	public function test_it_throws_if_a_required_named_arguments_is_missing(): void {
		$this->expectException( FailedToMakeInstance::class );

		( new SimpleInjector() )
			->make( Fixture\DummyClassWithNamedArguments::class );
	}

	public function test_it_throws_if_a_circular_reference_is_detected(): void {
		$this->expectException( FailedToMakeInstance::class );
		$this->expectExceptionCode( FailedToMakeInstance::CIRCULAR_REFERENCE );

		( new SimpleInjector() )
			->bind(
				Fixture\DummyClass::class,
				Fixture\DummyClassWithDependency::class
			)
			->make( Fixture\DummyClassWithDependency::class );
	}

	public function test_it_can_delegate_instantiation(): void {
		$injector = ( new SimpleInjector() )
			->delegate(
				Fixture\DummyInterface::class,
				static function ( $class ) {
					$object             = new stdClass();
					$object->class_name = $class;
					return $object;
				}
			);
		$object   = $injector->make( Fixture\DummyInterface::class );

		$this->assertInstanceOf( stdClass::class, $object );
		$this->assertTrue( property_exists( $object, 'class_name' ) );
		$this->assertEquals( Fixture\DummyInterface::class, $object->class_name );
	}

	public function test_delegation_works_across_resolution(): void {
		$injector = ( new SimpleInjector() )
			->bind(
				Fixture\DummyInterface::class,
				Fixture\DummyClassWithDependency::class
			)
			->delegate(
				Fixture\DummyClassWithDependency::class,
				static function ( $class ) {
					$object             = new stdClass();
					$object->class_name = $class;
					return $object;
				}
			);
		$object   = $injector->make( Fixture\DummyInterface::class );

		$this->assertInstanceOf( stdClass::class, $object );
		$this->assertTrue( property_exists( $object, 'class_name' ) );
		$this->assertEquals( Fixture\DummyClassWithDependency::class, $object->class_name );
	}

	public function test_arguments_can_be_bound(): void {
		/**
		 * @var class-string $global_arguments
		 */
		$global_arguments = SimpleInjector::GLOBAL_ARGUMENTS;

		$object = ( new SimpleInjector() )
			->bind_argument(
				Fixture\DummyClassWithNamedArguments::class,
				'argument_a',
				42
			)
			->bind_argument(
				$global_arguments,
				'argument_b',
				'Mr Alderson'
			)
			->make( Fixture\DummyClassWithNamedArguments::class );

		$this->assertEquals( 42, $object->get_argument_a() );
		$this->assertEquals( 'Mr Alderson', $object->get_argument_b() );
	}

	public function test_callable_arguments_are_lazily_resolved(): void {
		$injector = new SimpleInjector();
		$injector->bind_argument(
			Fixture\DummyClassWithNamedArguments::class,
			'argument_a',
			static fn( $class, $parameter, $arguments ) => $arguments['number']
		);

		$object = $injector->make( Fixture\DummyClassWithNamedArguments::class, [ 'number' => 123 ] );

		$this->assertInstanceOf( Fixture\DummyClassWithNamedArguments::class, $object );
		$this->assertEquals( 123, $object->get_argument_a() );
	}
}
