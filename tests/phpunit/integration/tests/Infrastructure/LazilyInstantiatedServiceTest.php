<?php

namespace Google\Web_Stories\Tests\Integration\Infrastructure;

use Google\Web_Stories\Exception\InvalidService;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Infrastructure\ServiceContainer\LazilyInstantiatedService;
use Google\Web_Stories\Tests\Integration\TestCase;
use stdClass;

final class LazilyInstantiatedServiceTest extends TestCase {

	public function test_it_can_be_instantiated(): void {
		$callable     = static function (): void {};
		$lazy_service = new LazilyInstantiatedService( $callable );

		$this->assertInstanceOf( LazilyInstantiatedService::class, $lazy_service );
	}

	public function test_it_can_return_the_actual_service_it_represents(): void {
		$callable     = function () {
			return $this->createMock( Service::class );
		};
		$lazy_service = new LazilyInstantiatedService( $callable );

		$this->assertInstanceOf( Service::class, $lazy_service->instantiate() );
	}

	public function test_it_throws_when_instantiating_an_invalid_service(): void {
		$callable     = function () {
			return new stdClass();
		};
		$lazy_service = new LazilyInstantiatedService( $callable );

		$this->expectException( InvalidService::class );
		$this->expectExceptionMessage( 'The service "stdClass" is not recognized and cannot be registered.' );
		$lazy_service->instantiate();
	}
}
