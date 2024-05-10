<?php

declare(strict_types = 1);

/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Google\Web_Stories\Tests\Integration;

use Google\Web_Stories\Story_Post_Type;

/**
 * @coversDefaultClass \Google\Web_Stories\Speculation_Rules
 */
class Speculation_Rules extends DependencyInjectedTestCase {
	private Story_Post_Type $story_post_type;

	protected \Google\Web_Stories\Speculation_Rules $instance;

	public function set_up(): void {
		parent::set_up();

		$this->story_post_type = $this->injector->make( Story_Post_Type::class );

		$this->instance = new \Google\Web_Stories\Speculation_Rules(
			$this->story_post_type,
		);
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();
		$this->assertSame( 10, has_action( 'admin_footer', [ $this->instance, 'print_rules' ] ) );
		$this->assertSame( 10, has_action( 'wp_footer', [ $this->instance, 'print_rules' ] ) );
	}

	/**
	 * @covers ::get_rules
	 */
	public function test_get_rules(): void {
		$prerendering_class = $this->getMockBuilder( \Google\Web_Stories\Speculation_Rules::class )
		->onlyMethods( [ 'get_rules' ] )
		->setConstructorArgs( [ $this->story_post_type ] )
		->getMock();

		$expected_rules = [
			'prerender' => [
				[
					'source'    => 'document',
					'where'     => [
						'and' => [
							[ 'href_matches' => [ Story_Post_Type::REWRITE_SLUG, sprintf( '/%s/*', $this->story_post_type::REWRITE_SLUG ) ] ],
						],
					],
					'eagerness' => 'moderate',
				],
			],
		];

		$prerendering_class->expects( $this->once() )
			->method( 'get_rules' )
			->willReturn( $expected_rules );

		$actual_rules = $prerendering_class->get_rules();
		$this->assertEquals( $expected_rules, $actual_rules );
	}

	/**
	 * @covers ::print_rules
	 */
	public function test_print_rules(): void {
		$prerendering_class = $this->getMockBuilder( \Google\Web_Stories\Speculation_Rules::class )
			->onlyMethods( [ 'get_rules' ] )
			->setConstructorArgs( [ $this->story_post_type ] )
			->getMock();

		$mock_rules = [
			'prerender' => [
				[
					'source'    => 'document',
					'where'     => [
						'and' => [
							[ 'href_matches' => [ Story_Post_Type::REWRITE_SLUG, sprintf( '/%s/*', $this->story_post_type::REWRITE_SLUG ) ] ],
						],
					],
					'eagerness' => 'moderate',
				],
			],
		];

		$prerendering_class->expects( $this->once() )
			->method( 'get_rules' )
			->willReturn( $mock_rules );

		ob_start();

		$prerendering_class->print_rules();

		$printed_output = ob_get_clean();

		$this->assertNotFalse( $printed_output, 'Output buffering failed' );

		$encoded_rules = wp_json_encode( $mock_rules );
		if ( false !== $encoded_rules ) {
			$this->assertStringContainsString( $encoded_rules, $printed_output );
		} else {
			$this->fail( 'JSON decoding failed.' );
		}
	}
}
