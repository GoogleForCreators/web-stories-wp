<?php

declare(strict_types = 1);

namespace Google\Web_Stories\Tests\Integration\Infrastructure;

use Google\Web_Stories\Exception\InvalidService;
use Google\Web_Stories\Infrastructure\ServiceContainer\LazilyInstantiatedService;
use Google\Web_Stories\Tests\Integration\TestCase;
use stdClass;

final class LazilyInstantiatedServiceTest extends TestCase {
	public function test_it_throws_when_instantiating_an_invalid_service(): void {
		$callable     = static fn() => new stdClass();
		$lazy_service = new LazilyInstantiatedService( $callable );

		$this->expectException( InvalidService::class );
		$this->expectExceptionMessage( 'The service "stdClass" is not recognized and cannot be registered.' );
		$lazy_service->instantiate();
	}
}
