<?php
/**
 * Story_Revisions class.
 *
 * Responsible for WordPress revisions integration.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

use WP_Post;

/**
 * Revisions class.
 *
 * @phpstan-type RevisionField array{
 *   id: string,
 *   name: string,
 *   diff: string
 * }
 * @phpstan-type PostData array{
 *   post_parent: int,
 *   post_type: string,
 *   post_content?: string,
 *   post_content_filtered?: string
 * }
 */
class Story_Revisions extends Service_Base {

	/**
	 * Story post type instance.
	 *
	 * @var Story_Post_Type Story post type instance.
	 */
	private Story_Post_Type $story_post_type;

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private Assets $assets;

	/**
	 * Single constructor.
	 *
	 * @param Story_Post_Type $story_post_type Story post type instance.
	 * @param Assets          $assets  Assets instance.
	 */
	public function __construct( Story_Post_Type $story_post_type, Assets $assets ) {
		$this->story_post_type = $story_post_type;
		$this->assets          = $assets;
	}

	/**
	 * Initialize admin-related functionality.
	 *
	 * @since 1.25.0
	 */
	public function register(): void {
		$post_type = $this->story_post_type->get_slug();
		add_filter( "wp_{$post_type}_revisions_to_keep", [ $this, 'revisions_to_keep' ] );
		add_filter( '_wp_post_revision_fields', [ $this, 'filter_revision_fields' ], 10, 2 );
		add_filter( 'wp_get_revision_ui_diff', [ $this, 'filter_revision_ui_diff' ], 10, 3 );

		add_action( 'admin_print_footer_scripts-revision.php', [ $this, 'enqueue_player_script' ] );
	}

	/**
	 * Force WordPress to only keep 10 revisions for the web stories post type.
	 *
	 * @since 1.25.0
	 *
	 * @param int|bool $num Number of revisions to store.
	 * @return int Number of revisions to store.
	 */
	public function revisions_to_keep( $num ): int {
		$num = (int) $num;
		return $num >= 0 && $num < 10 ? $num : 10;
	}

	/**
	 * Filters the revision fields to ensure that JSON representation gets saved to Story revisions.
	 *
	 * @since 1.25.0
	 *
	 * @param array|mixed         $fields Array of allowed revision fields.
	 * @param array<string,mixed> $story  Story post array.
	 * @return array|mixed Array of allowed fields.
	 *
	 * @template T
	 *
	 * @phpstan-param PostData $story
	 * @phpstan-return ($fields is array<T> ? array<T> : mixed)
	 */
	public function filter_revision_fields( $fields, array $story ) {
		if ( ! \is_array( $fields ) ) {
			return $fields;
		}

		if (
			$this->story_post_type->get_slug() === $story['post_type'] ||
			(
				'revision' === $story['post_type'] &&
				! empty( $story['post_parent'] ) &&
				get_post_type( $story['post_parent'] ) === $this->story_post_type->get_slug()
			)
		) {
			$fields['post_content_filtered'] = __( 'Story data', 'web-stories' );
		}

		return $fields;
	}

	/**
	 * Filters the fields displayed in the post revision diff UI.
	 *
	 * @since 1.25.0
	 *
	 * @param array[]|mixed $fields       Array of revision UI fields. Each item is an array of id, name, and diff.
	 * @param WP_Post|false $compare_from The revision post to compare from or false if dealing with the first revision.
	 * @param WP_Post       $compare_to   The revision post to compare to.
	 * @return array[]|mixed Filtered array of revision UI fields.
	 *
	 * @phpstan-return array<int, RevisionField[]>|mixed
	 */
	public function filter_revision_ui_diff( $fields, $compare_from, WP_Post $compare_to ) {
		if ( ! \is_array( $fields ) ) {
			return $fields;
		}

		$parent = get_post_parent( $compare_to );

		if (
			! $parent instanceof WP_Post ||
			$this->story_post_type->get_slug() !== $parent->post_type
		) {
			return $fields;
		}

		$player_from = '';

		if ( $compare_from instanceof WP_Post ) {
			$player_from = $this->get_story_player( $compare_from );
		}

		$player_to = $this->get_story_player( $compare_to );

		$args = [
			'show_split_view' => true,
			'title_left'      => __( 'Removed' ), // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
			'title_right'     => __( 'Added' ), // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
		];

		/** This filter is documented in wp-admin/includes/revision.php */
		$args = apply_filters( 'revision_text_diff_options', $args, 'post_content', $compare_from, $compare_to );

		$fields_to_return = [];

		/**
		 * Revision field.
		 *
		 * @phpstan-var RevisionField $field
		 * @var array $field
		 */
		foreach ( $fields as $field ) {
			if ( 'post_title' === $field['id'] ) {
				$fields_to_return[] = $field;
			}

			if (
				'post_content' === $field['id'] ||
				'post_content_filtered' === $field['id']
			) {
				$field['title'] = __( 'Content', 'web-stories' );

				$diff = '<table class="diff"><colgroup><col class="content diffsplit left"><col class="content diffsplit middle"><col class="content diffsplit right"></colgroup><tbody><tr>';

				// In split screen mode, show the title before/after side by side.
				if ( true === $args['show_split_view'] ) {
					$diff .= '<td>' . $player_from . '</td><td></td><td>' . $player_to . '</td>';
				} else {
					$diff .= '<td>' . $player_from . '</td></tr><tr><td>' . $player_to . '</td>';
				}

				$diff .= '</tr></tbody>';
				$diff .= '</table>';

				$field['diff'] = $diff;

				$fields_to_return[] = $field;
				return $fields_to_return;
			}
		}

		return $fields;
	}

	/**
	 * Enqueues amp-story-player assets on the revisions screen.
	 *
	 * @since 1.25.0
	 */
	public function enqueue_player_script(): void {
		$this->assets->enqueue_style( AMP_Story_Player_Assets::SCRIPT_HANDLE );
		$this->assets->enqueue_script( AMP_Story_Player_Assets::SCRIPT_HANDLE );

		wp_add_inline_script(
			AMP_Story_Player_Assets::SCRIPT_HANDLE,
			<<<'JS'
				const loadPlayers = () => document.querySelectorAll('amp-story-player').forEach(playerEl => (new AmpStoryPlayer(window, playerEl)).load());
				const originalFrame = wp.revisions.view.Frame;
				wp.revisions.view.Frame = originalFrame.extend({
					render: function() {
						originalFrame.prototype.render.apply(this, arguments);
						loadPlayers();
						this.listenTo( this.model, 'update:diff', () => loadPlayers() );
					},
				});
			JS
		);
	}

	/**
	 * Returns the story player markup for a given post.
	 *
	 * @since 1.25.0
	 *
	 * @param WP_Post $post Post instance.
	 * @return string Story player markup.
	 */
	protected function get_story_player( WP_Post $post ): string {
		$url   = esc_url(
			wp_nonce_url(
				add_query_arg( 'rev_id', $post->ID, get_permalink( $post->post_parent ) ),
				'web_stories_revision_for_' . $post->post_parent
			)
		);
		$title = esc_html( get_the_title( $post ) );
		return <<<Player
				<amp-story-player style="width: 300px; height: 500px; display: flex;"><a href="$url">$title</a></amp-story-player>
				Player;
	}
}
