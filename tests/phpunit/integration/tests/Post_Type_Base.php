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

namespace Google\Web_Stories\Tests\Integration;

use Google\Web_Stories\Tests\Integration\Fixture\DummyPostTypeWithCustomArchive;
use Google\Web_Stories\Tests\Integration\Fixture\DummyPostTypeWithoutArchive;

/**
 * @coversDefaultClass \Google\Web_Stories\Post_Type_Base
 */
class Post_Type_Base extends DependencyInjectedTestCase {

	/**
	 * @var \Google\Web_Stories\Post_Type_Base
	 */
	protected static $cpt_no_archive;

	/**
	 * @var \Google\Web_Stories\Post_Type_Base
	 */
	protected static $cpt_custom_archive;

	public function set_up(): void {
		parent::set_up();

		self::$cpt_no_archive = new DummyPostTypeWithoutArchive();
		self::$cpt_no_archive->register();

		self::$cpt_custom_archive = new DummyPostTypeWithCustomArchive();
		self::$cpt_custom_archive->register();
	}

	public function tear_down(): void {
		self::$cpt_no_archive->unregister_post_type();
		self::$cpt_custom_archive->unregister_post_type();

		parent::tear_down();
	}

	/**
	 * @covers ::get_archive_link
	 */
	public function test_get_archive_link_no_archive(): void {
		$link = self::$cpt_no_archive->get_archive_link();
		$this->assertSame( home_url( '/?post_type=cpt-without-archive' ), $link );
	}

	/**
	 * @covers ::get_archive_link
	 */
	public function test_get_archive_link_no_archive_pretty_permalinks(): void {
		$this->set_permalink_structure( '/%postname%/' );

		self::$cpt_no_archive->unregister_post_type();
		self::$cpt_no_archive = new DummyPostTypeWithoutArchive();
		self::$cpt_no_archive->register();

		$link = self::$cpt_no_archive->get_archive_link();
		$this->assertSame( home_url( '/' ), $link );
	}

	/**
	 * @covers ::get_archive_link
	 */
	public function test_get_archive_link_custom_archive(): void {
		$link = self::$cpt_custom_archive->get_archive_link();
		$this->assertSame( home_url( '/?post_type=cpt-custom-archive' ), $link );
	}

	/**
	 * @covers ::get_archive_link
	 */
	public function test_get_archive_link_custom_archive_pretty_permalinks(): void {
		$this->set_permalink_structure( '/%postname%/' );

		self::$cpt_custom_archive->unregister_post_type();
		self::$cpt_custom_archive = new DummyPostTypeWithCustomArchive();
		self::$cpt_custom_archive->register();

		$link = self::$cpt_custom_archive->get_archive_link();
		$this->assertSame( home_url( '/custom-archive-slug/' ), $link );
	}

	/**
	 * @covers ::get_archive_link
	 */
	public function test_get_default_archive_link_no_archive(): void {
		$link = self::$cpt_no_archive->get_archive_link( true );
		$this->assertSame( home_url( '?post_type=cpt-without-archive' ), $link );
	}

	/**
	 * @covers ::get_archive_link
	 */
	public function test_get_default_archive_link_no_archive_pretty_permalinks(): void {
		$this->set_permalink_structure( '/%postname%/' );

		self::$cpt_no_archive->unregister_post_type();
		self::$cpt_no_archive = new DummyPostTypeWithoutArchive();
		self::$cpt_no_archive->register();

		$link = self::$cpt_no_archive->get_archive_link( true );
		$this->assertSame( home_url( '/cpt-without-archive/' ), $link );
	}

	/**
	 * @covers ::get_archive_link
	 */
	public function test_get_default_archive_link_custom_archive(): void {
		$link = self::$cpt_custom_archive->get_archive_link( true );
		$this->assertSame( home_url( '?post_type=cpt-custom-archive' ), $link );
	}
	/**
	 * @covers ::get_archive_link
	 */
	public function test_get_default_archive_link_custom_archive_pretty_permalinks(): void {
		$this->set_permalink_structure( '/%postname%/' );

		self::$cpt_custom_archive->unregister_post_type();
		self::$cpt_custom_archive = new DummyPostTypeWithCustomArchive();
		self::$cpt_custom_archive->register();

		$link = self::$cpt_custom_archive->get_archive_link( true );
		$this->assertSame( home_url( '/cpt-custom-archive/' ), $link );
	}

	/**
	 * @covers ::on_plugin_uninstall
	 */
	public function test_on_plugin_uninstall(): void {
		self::$cpt_custom_archive->register();
		self::factory()->post->create(
			[
				'post_type'    => self::$cpt_custom_archive->get_slug(),
				'post_status'  => 'publish',
				'post_content' => 'Example content',
			]
		);
		self::$cpt_custom_archive->on_plugin_uninstall();
		$cpt_posts = get_posts(
			[
				'fields'           => 'ids',
				'suppress_filters' => false,
				'post_status'      => 'any',
				'post_type'        => self::$cpt_custom_archive->get_slug(),
				'posts_per_page'   => -1,
			]
		);

		$this->assertSameSets( [], $cpt_posts );
	}
}
