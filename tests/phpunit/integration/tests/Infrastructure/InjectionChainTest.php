<?php

declare(strict_types = 1);

namespace Google\Web_Stories\Tests\Integration\Infrastructure;

use Google\Web_Stories\Infrastructure\Injector\InjectionChain;
use Google\Web_Stories\Tests\Integration\TestCase;

// phpcs:disable Generic.Files.OneObjectStructurePerFile.MultipleFound

class Something {}

class SomethingElse {}

class First {}

class Second {}

class Third {}

final class InjectionChainTest extends TestCase {
	public function test_it_accepts_new_resolutions(): void {
		$chain = ( new InjectionChain() )
			->add_resolution( Something::class );

		$this->assertTrue( $chain->has_resolution( Something::class ) );
		$this->assertFalse( $chain->has_resolution( SomethingElse::class ) );
	}

	public function test_it_accepts_new_chain_entries(): void {
		$chain = ( new InjectionChain() )
			->add_to_chain( Something::class );

		$this->assertEquals( Something::class, $chain->get_class() );
	}

	public function test_it_returns_the_last_class_in_the_chain(): void {
		$chain = ( new InjectionChain() )
			->add_to_chain( First::class )
			->add_to_chain( Second::class )
			->add_to_chain( Third::class );

		$this->assertEquals( Third::class, $chain->get_class() );
	}

	public function test_it_retains_all_elements_in_the_chain(): void {
		$chain = ( new InjectionChain() )
			->add_to_chain( First::class )
			->add_to_chain( Second::class )
			->add_to_chain( Third::class );

		$this->assertEquals( [ Third::class, Second::class, First::class ], $chain->get_chain() );
	}
}
