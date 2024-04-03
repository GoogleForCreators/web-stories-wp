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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Service_Base;

/**
 * Speculative_Prerendering class.
 */
class Speculative_Prerendering extends Service_Base {

	/**
	 * Array defining the matches for different pages.
	 *
	 * @var array<string,array<string>>
	 */
	private array $matches = [
		'dashboard'   => [ 'post.php?post=*&action=edit', 'post-new.php?post_type=web-story' ],
		'all_stories' => [ 'post.php?post=*&action=edit', 'post-new.php?post_type=web-story', '/web-stories*' ],
		'archive'     => [ '/web-stories*' ],
	];

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
		if ( 'web-story_page_stories-dashboard' === $hook ) {
			$rules = $this->get_rules( 'dashboard' );
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Nonce verification not needed as we're just checking for the 'web-story' post type.
		if ( 'edit.php' === $hook && isset( $_GET['post_type'] ) && 'web-story' === $_GET['post_type'] ) {
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
							'href_matches' => $this->matches[ $page ],
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
}
