<?php
/**
 * Class Speculation_Rules
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2024 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2024 Google LLC
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

declare(strict_types = 1);

namespace Google\Web_Stories;

/**
 * Speculation_Rules class.
 *
 * @since 1.37.0
 */
class Speculation_Rules extends Service_Base {
	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private Story_Post_Type $story_post_type;

	/**
	 * Speculation_Rules constructor.
	 *
	 * @param Story_Post_Type $story_post_type  Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		$this->story_post_type = $story_post_type;
	}

	/**
	 * Runs on instantiation.
	 */
	public function register(): void {
		add_action( 'admin_footer', [ $this, 'print_rules' ] );
		add_action( 'wp_footer', [ $this, 'print_rules' ] );
	}

	/**
	 * Retrieves the prerendering rules for a specific page.
	 *
	 * @return array<string, array<int, array<string, mixed>>> An array containing prerendering rules.
	 */
	public function get_rules(): array {
		$rules = [];

		if ( ! is_admin() ) {
			$view_story_url = sprintf(
				'/%s/*',
				$this->story_post_type::REWRITE_SLUG
			);
			$archive_url    = Story_Post_Type::REWRITE_SLUG;

			$rules = [
				'prerender' => [
					[
						'source'    => 'document',
						'where'     => [
							'href_matches' => [
								$archive_url,
								$view_story_url,
							],
						],
						'eagerness' => 'moderate',
					],
				],
			];
		}

		/**
		 * Filters the prerendering rules.
		 *
		 * @param array $rules An array of prerendering rules.
		 * @since 1.37.0
		 */
		return apply_filters( 'web_stories_speculation_rules', $rules );
	}

	/**
	 * Prints the prerendering rules as an inline script tag.
	 */
	public function print_rules(): void {
		$rules = $this->get_rules();
		if ( empty( $rules ) ) {
			return;
		}

		$encoded_rules = wp_json_encode( $rules, JSON_UNESCAPED_SLASHES );

		if ( false !== $encoded_rules ) {
			wp_print_inline_script_tag( $encoded_rules, [ 'type' => 'speculationrules' ] );
		}
	}
}
