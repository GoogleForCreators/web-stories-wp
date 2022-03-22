<?php

namespace Google\Web_Stories\Tests\Integration\Fixture;

final class DummyClassWithNamedArguments {

	/** @var int */
	private $argument_a;

	/** @var string */
	private $argument_b;

	public function __construct( $argument_a, $argument_b = 'Mr Meeseeks' ) {
		$this->argument_a = $argument_a;
		$this->argument_b = $argument_b;
	}

	/**
	 * @return mixed
	 */
	public function get_argument_a() {
		return $this->argument_a;
	}

	/**
	 * @return mixed
	 */
	public function get_argument_b() {
		return $this->argument_b;
	}
}
