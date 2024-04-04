<?php
/**
 * Class Speculative_Prerendering
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

use Google\Web_Stories\Admin\Dashboard;

/**
 * Speculative_Prerendering class.
 */
class Speculative_Prerendering extends Service_Base {
	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private Context $context;

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private Story_Post_Type $story_post_type;

	/**
	 * Dashboard instance.
	 *
	 * @var Dashboard Dashboard instance.
	 */
	private Dashboard $dashboard;

	/**
	 * Speculative_Prerendering constructor.
	 *
	 * @param Context         $context          Context instance.
	 * @param Story_Post_Type $story_post_type  Story_Post_Type instance.
	 * @param Dashboard       $dashboard        Dashboard instance.
	 */
	public function __construct( Context $context, Story_Post_Type $story_post_type, Dashboard $dashboard ) {
		$this->context         = $context;
		$this->story_post_type = $story_post_type;
		$this->dashboard       = $dashboard;
	}

	/**
	 * Runs on instantiation.
	 */
	public function register(): void {
		add_action( 'admin_enqueue_scripts', [ $this, 'load_rules' ] );
	}

	/**
	 * Loads the prerendering rules based on the current page.
	 *
	 * @param string $hook The current page hook.
	 */
	public function load_rules( string $hook ): void {
		$rules = [];

		$hook_suffix = $this->dashboard->get_hook_suffix( 'stories-dashboard' );
		if ( false !== $hook_suffix && $hook_suffix === $hook ) {
			$rules = $this->get_rules( 'dashboard' );
		}

		if ( $this->story_post_type->get_slug() === $this->context->get_screen_post_type() && 'edit' === $this->context->get_screen_base() ) {
			$rules = $this->get_rules( 'all_stories' );
		}
		$this->print_rules( $rules );
	}

	/**
	 * Retrieves the prerendering rules for a specific page.
	 *
	 * @param string $page The page identifier.
	 * @return array An array containing prerendering rules.
	 */
	public function get_rules( string $page ): array {
		$rules = [
			[
				'source'    => 'document',
				'where'     => [
					'and' => [
						[
							'href_matches' => $this->get_matches_for_page( $page ),
						],
					],
				],
				'eagerness' => 'moderate',
			],
		];

		return [ 'prerender' => $rules ];
	}

	/**
	 * Prints the prerendering rules as an inline script tag.
	 *
	 * @param array $rules The prerendering rules to print.
	 */
	public function print_rules( array $rules ): void {
		if ( empty( $rules ) ) {
			return;
		}

		$encoded_rules = wp_json_encode( $rules );

		if ( false !== $encoded_rules ) {
			wp_print_inline_script_tag( $encoded_rules, [ 'type' => 'speculationrules' ] );
		}
	}

	/**
	 * Generates the URL matches array for different pages.
	 *
	 * @return array The URL matches array containing URLs for different pages.
	 */
	private function generate_matches(): array {
		$new_story_url  = sprintf(
			'post-new.php?post_type=%s',
			$this->story_post_type->get_slug()
		);
		$edit_story_url = 'post.php?post=*&action=edit';
		$view_story_url = sprintf(
			'/%s/*',
			$this->story_post_type::REWRITE_SLUG
		);

		return [
			'dashboard'   => [ $edit_story_url, $new_story_url ],
			'all_stories' => [ $edit_story_url, $new_story_url, $view_story_url ],
			'archive'     => [ $view_story_url ],
		];
	}

	/**
	 * Retrieves the URL matches for the specified page.
	 *
	 * @param string $page The page for which to retrieve URL matches.
	 * @return array The URL matches for the specified page.
	 */
	private function get_matches_for_page( string $page ): array {
		$matches = $this->generate_matches();
		return $matches[ $page ];
	}
}
