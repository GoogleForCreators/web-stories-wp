<?php

declare(strict_types = 1);

namespace Google\Web_Stories\Tests\Integration\Fixture;

final class DummyClassWithDependency implements DummyInterface {

	private DummyClass $dummy;

	public function __construct( DummyClass $dummy ) {
		$this->dummy = $dummy;
	}

	public function get_dummy(): DummyClass {
		return $this->dummy;
	}
}
