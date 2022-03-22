<?php

namespace Google\Web_Stories\Tests\Integration\Fixture;

final class DummyClassWithDependency implements DummyInterface {

	/** @var DummyClass */
	private $dummy;

	public function __construct( DummyClass $dummy ) {
		$this->dummy = $dummy;
	}

	/**
	 */
	public function get_dummy(): DummyClass {
		return $this->dummy;
	}
}
