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

use Google\Web_Stories\Admin\Dashboard;
use Google\Web_Stories\Context;
use Google\Web_Stories\Story_Post_Type;
use PHPUnit\Framework\MockObject\MockObject;

/**
 * @coversDefaultClass \Google\Web_Stories\Speculative_Prerendering
 */
class Speculative_Prerendering extends DependencyInjectedTestCase {
	/**
	 * @var Context & MockObject
	 */
	private $context;

	/**
	 * @var Story_Post_Type & MockObject
	 */
	private $story_post_type;

	/**
	 * @var Dashboard & MockObject
	 */
	private $dashboard;

	protected \Google\Web_Stories\Speculative_Prerendering $instance;

	public function set_up(): void {
		parent::set_up();

		$this->dashboard       = $this->createMock( Dashboard::class );
		$this->story_post_type = $this->createMock( Story_Post_Type::class );
		$this->context         = $this->createMock( Context::class );

		$this->instance = new \Google\Web_Stories\Speculative_Prerendering(
			$this->context,
			$this->story_post_type,
			$this->dashboard,
		);
	}

	/**
	 * @covers ::register
	 */
	public function test_register(): void {
		$this->instance->register();
		$this->assertSame( 10, has_action( 'admin_enqueue_scripts', [ $this->instance, 'load_rules' ] ) );
	}

	/**
	 * @covers ::load_rules
	 */
	public function test_load_rules_dashboard(): void {
		$this->dashboard->method( 'get_hook_suffix' )->willReturn( 'web-story_page_stories-dashboard' );

		$prerendering_class = $this->getMockBuilder( \Google\Web_Stories\Speculative_Prerendering::class )
		->onlyMethods( [ 'get_rules' ] )
		->setConstructorArgs( [ $this->context, $this->story_post_type, $this->dashboard ] )
		->getMock();

		$prerendering_class->expects( $this->once() )
		->method( 'get_rules' )
		->with( 'dashboard' );

		$prerendering_class->load_rules( 'web-story_page_stories-dashboard' );
	}

	/**
	 * @covers ::load_rules
	 */
	public function test_load_rules_all_stories(): void {
		$this->story_post_type->method( 'get_slug' )->willReturn( 'web-story' );
		$this->context->method( 'get_screen_post_type' )->willReturn( 'web-story' );
		$this->context->method( 'get_screen_base' )->willReturn( 'edit' );

		$prerendering_class = $this->getMockBuilder( \Google\Web_Stories\Speculative_Prerendering::class )
			->onlyMethods( [ 'get_rules' ] )
			->setConstructorArgs( [ $this->context, $this->story_post_type, $this->dashboard ] )
			->getMock();

		$prerendering_class->expects( $this->once() )
		->method( 'get_rules' )
		->with( 'all_stories' );

		$prerendering_class->load_rules( 'edit' );
	}
}
