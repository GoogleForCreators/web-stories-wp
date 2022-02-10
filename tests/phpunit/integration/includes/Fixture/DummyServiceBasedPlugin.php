<?php

namespace Google\Web_Stories\Tests\Integration\Fixture;

use Google\Web_Stories\Infrastructure\ServiceBasedPlugin;

class DummyServiceBasedPlugin extends ServiceBasedPlugin {

	/**
	 * Get the list of services to register.
	 *
	 * @return array<string> Associative array of identifiers mapped to fully
	 *                       qualified class names.
	 */
	protected function get_service_classes(): array {
		return [
			'service_a' => DummyService::class,
			'service_b' => DummyService::class,
		];
	}
}
