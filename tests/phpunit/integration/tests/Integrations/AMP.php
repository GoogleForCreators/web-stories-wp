<?php
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

namespace Google\Web_Stories\Tests\Integration\Integrations;

use DOMDocument;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tests\Integration\DependencyInjectedTestCase;

/**
 * @coversDefaultClass \Google\Web_Stories\Integrations\AMP
 */
class AMP extends DependencyInjectedTestCase {
	/**
	 * @var \Google\Web_Stories\Integrations\AMP
	 */
	private $instance;

	public function set_up(): void {
		parent::set_up();

		$this->instance = $this->injector->make( \Google\Web_Stories\Integrations\AMP::class );
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();

		$this->assertSame( 10, has_filter( 'option_amp-options', [ $this->instance, 'filter_amp_options' ] ) );
		$this->assertSame( 10, has_filter( 'amp_supportable_post_types', [ $this->instance, 'filter_supportable_post_types' ] ) );
		$this->assertSame( 10, has_filter( 'amp_to_amp_linking_element_excluded', [ $this->instance, 'filter_amp_to_amp_linking_element_excluded' ] ) );
		$this->assertSame( 10, has_filter( 'amp_validation_error_sanitized', [ $this->instance, 'filter_amp_validation_error_sanitized' ] ) );
		$this->assertSame( 10, has_filter( 'web_stories_amp_validation_error_sanitized', [ $this->instance, 'filter_amp_validation_error_sanitized' ] ) );

		remove_all_filters( 'option_amp-options' );
		remove_all_filters( 'amp_supportable_post_types' );
		remove_all_filters( 'amp_to_amp_linking_element_excluded' );
		remove_all_filters( 'amp_validation_error_sanitized' );
		remove_all_filters( 'web_stories_amp_validation_error_sanitized' );
	}

	/**
	 * @covers ::filter_amp_options
	 */
	public function test_filter_amp_options_if_not_requested_post_type(): void {
		$this->assertEqualSets( [], $this->instance->filter_amp_options( [] ) );
	}

	/**
	 * @covers ::filter_amp_options
	 */
	public function test_filter_amp_options(): void {
		$GLOBALS['current_screen'] = convert_to_screen( Story_Post_Type::POST_TYPE_SLUG );

		$before = [
			'theme_support'        => 'reader',
			'supported_post_types' => [ 'post' ],
			'supported_templates'  => [ 'is_page' ],
		];

		$expected = [
			'theme_support'        => 'standard',
			'supported_post_types' => [ 'post', Story_Post_Type::POST_TYPE_SLUG ],
			'supported_templates'  => [ 'is_page', 'is_singular' ],
		];

		$actual = $this->instance->filter_amp_options( $before );

		$this->assertEqualSets( $expected, $actual );
	}

	/**
	 * @covers ::filter_supportable_post_types
	 */
	public function test_filter_supportable_post_types_if_not_requested_post_type(): void {

		$this->assertEqualSets( [], $this->instance->filter_supportable_post_types( [ Story_Post_Type::POST_TYPE_SLUG ] ) );
	}

	/**
	 * @covers ::filter_supportable_post_types
	 */
	public function test_filter_supportable_post_types(): void {
		$GLOBALS['current_screen'] = convert_to_screen( Story_Post_Type::POST_TYPE_SLUG );

		$actual = $this->instance->filter_supportable_post_types( [] );

		$this->assertEqualSets( [ Story_Post_Type::POST_TYPE_SLUG ], $actual );
	}

	public function data_test_filter_amp_to_amp_linking_element_excluded(): array {
		$doc = new DOMDocument( '1.0', 'utf-8' );

		$anchor        = $doc->createElement( 'a' );
		$player_anchor = $doc->createElement( 'a' );
		$div_anchor    = $doc->createElement( 'a' );
		$player        = $doc->createElement( 'amp-story-player' );
		$div           = $doc->createElement( 'div' );
		$player->appendChild( $player_anchor );
		$div->appendChild( $div_anchor );

		$doc->appendChild( $player );
		$doc->appendChild( $div );

		return [
			'No instance of DOMElement' => [
				[ false, '', [], null ],
				false,
			],
			'No parent node'            => [
				[ false, '', [], $anchor ],
				false,
			],
			'Wrong parent node'         => [
				[ false, '', [], $div_anchor ],
				false,
			],
			'Corecct node'              => [
				[ false, '', [], $player_anchor ],
				true,
			],
		];
	}

	/**
	 * @covers ::filter_amp_to_amp_linking_element_excluded
	 * @dataProvider data_test_filter_amp_to_amp_linking_element_excluded
	 */
	public function test_filter_amp_to_amp_linking_element_excluded( $args, $expected ): void {
		$actual = $this->instance->filter_amp_to_amp_linking_element_excluded( ...$args );
		$this->assertSame( $actual, $expected );
	}
}
