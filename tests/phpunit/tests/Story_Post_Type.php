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

namespace Google\Web_Stories\Tests;

class Story_Post_Type extends \WP_UnitTestCase {

	public function setUp() {
		parent::setUp();
		do_action( 'init' );
	}

	public function test_filter_rest_collection_params() {
		$query_params = [
			'foo',
			'orderby' => [
				'enum' => [],
			],
		];

		$post_type       = get_post_type_object( \Google\Web_Stories\Story_Post_Type::POST_TYPE_SLUG );
		$filtered_params = \Google\Web_Stories\Story_Post_Type::filter_rest_collection_params( $query_params, $post_type );
		$this->assertEquals(
			$filtered_params,
			[
				'foo',
				'orderby' => [
					'enum' => [ 'story_author' ],
				],
			]
		);
	}

	public function test_filter_rest_collection_params_incorrect_post_type() {
		$query_params = [
			'foo',
			'orderby' => [
				'enum' => [],
			],
		];

		$post_type       = new \stdClass();
		$post_type->name = 'post';
		$filtered_params = \Google\Web_Stories\Story_Post_Type::filter_rest_collection_params( $query_params, $post_type );
		$this->assertEquals( $filtered_params, $query_params );
	}
}
