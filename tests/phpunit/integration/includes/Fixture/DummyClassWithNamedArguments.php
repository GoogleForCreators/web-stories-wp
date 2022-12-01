<?php

declare(strict_types = 1);

namespace Google\Web_Stories\Tests\Integration\Fixture;

final class DummyClassWithNamedArguments {

	private int $argument_a;

	private string $argument_b;

	public function __construct( int $argument_a, string $argument_b = 'Mr Meeseeks' ) {
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
