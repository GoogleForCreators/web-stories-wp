<?php
/**
 * Class Web_Stories_Block.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

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

declare(strict_types = 1);

namespace Google\Web_Stories\Block;

use Google\Web_Stories\AMP_Story_Player_Assets;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Context;
use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Stories_Script_Data;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Story_Query;
use Google\Web_Stories\Tracking;
use WP_Block;

/**
 * Latest Stories block class.
 *
 * @phpstan-import-type StoryAttributes from \Google\Web_Stories\Story_Query
 * @phpstan-type BlockAttributes array{
 *   blockType?: string,
 *   url?: string,
 *   title?: string,
 *   poster?: string,
 *   width?: int,
 *   height?: int,
 *   align?: string,
 *   stories?: int[],
 *   viewType?: string,
 *   numOfStories?: int,
 *   numOfColumns?: int,
 *   circleSize?: int,
 *   imageAlignment?: string,
 *   orderby?: string,
 *   order?: string,
 *   archiveLinkLabel?: string,
 *   authors?: int[],
 *   fieldState?: array<string, mixed>,
 *   previewOnly?: bool,
 *   taxQuery?: array<string, int[]>
 * }
 * @phpstan-type BlockAttributesWithDefaults array{
 *   blockType?: string,
 *   url?: string,
 *   title?: string,
 *   poster?: string,
 *   width?: int,
 *   height?: int,
 *   align: string,
 *   stories?: int[],
 *   viewType?: string,
 *   numOfStories?: int,
 *   numOfColumns?: int,
 *   circleSize?: int,
 *   imageAlignment?: string,
 *   orderby?: string,
 *   order?: string,
 *   archiveLinkLabel?: string,
 *   authors?: int[],
 *   fieldState?: array<string, mixed>,
 *   previewOnly?: bool
 * }
 */
class Web_Stories_Block extends Embed_Base {

	/**
	 * Script handle.
	 */
	public const SCRIPT_HANDLE = 'web-stories-block';

	/**
	 * Maximum number of stories users can select
	 */
	public const MAX_NUM_OF_STORIES = 20;

	/**
	 * Current block's block attributes.
	 *
	 * @var array<string, mixed> Block Attributes.
	 * @phpstan-var BlockAttributes
	 */
	protected array $block_attributes;

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	protected Story_Post_Type $story_post_type;

	/**
	 * Stories_Script_Data instance.
	 *
	 * @var Stories_Script_Data Stories_Script_Data instance.
	 */
	protected Stories_Script_Data $stories_script_data;

	/**
	 * Embed Base constructor.
	 *
	 * @since 1.14.0
	 *
	 * @param Assets              $assets              Assets instance.
	 * @param Story_Post_Type     $story_post_type     Story_Post_Type instance.
	 * @param Stories_Script_Data $stories_script_data Stories_Script_Data instance.
	 * @param Context             $context             Context instance.
	 */
	public function __construct(
		Assets $assets,
		Story_Post_Type $story_post_type,
		Stories_Script_Data $stories_script_data,
		Context $context
	) {
		parent::__construct( $assets, $context );

		$this->story_post_type     = $story_post_type;
		$this->stories_script_data = $stories_script_data;
	}

	/**
	 * Initializes the Web Stories embed block.
	 *
	 * @since 1.5.0
	 */
	public function register(): void {
		parent::register();
		$this->assets->register_script_asset( self::SCRIPT_HANDLE, [ AMP_Story_Player_Assets::SCRIPT_HANDLE, Tracking::SCRIPT_HANDLE ] );
		$this->assets->register_style_asset( self::SCRIPT_HANDLE, [ AMP_Story_Player_Assets::SCRIPT_HANDLE, parent::SCRIPT_HANDLE ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesBlockSettings',
			$this->get_script_settings()
		);

		$this->register_block_type();
	}

	/**
	 * Renders the block type output for given attributes.
	 *
	 * @since 1.5.0
	 *
	 * @param array<string, mixed> $attributes Block attributes.
	 * @param string               $content    Block content.
	 * @param WP_Block             $block      Block instance.
	 * @return string Rendered block type output.
	 *
	 * @phpstan-param BlockAttributesWithDefaults $attributes
	 */
	public function render_block( array $attributes, string $content, WP_Block $block ): string {
		if ( false === $this->initialize_block_attributes( $attributes ) ) {
			return '';
		}

		if ( isset( $block->context['postType'], $block->context['postId'] ) && 'web-story' === $block->context['postType'] && ! empty( $block->context['postId'] ) ) {
			$attributes = wp_parse_args( $attributes, $this->default_attrs() );

			$attributes['class'] = 'wp-block-web-stories-embed';

			$story = new Story();
			$story->load_from_post( get_post( $block->context['postId'] ) );

			return $this->render_story( $story, $attributes );
		}

		if ( ! empty( $attributes['blockType'] )
			&& ( 'latest-stories' === $attributes['blockType'] || 'selected-stories' === $attributes['blockType'] ) ) {

			$story_attributes = [
				'align'              => $attributes['align'],
				'view_type'          => $attributes['viewType']         ??= '',
				'archive_link_label' => $attributes['archiveLinkLabel'] ??= __( 'View all stories', 'web-stories' ),
				'circle_size'        => $attributes['circleSize']       ??= 96,
				'image_alignment'    => $attributes['imageAlignment']   ??= 96,
				'number_of_columns'  => $attributes['numOfColumns']     ??= 2,
			];

			/**
			 * Story Attributes.
			 *
			 * @phpstan-var StoryAttributes $story_attributes
			 */
			$story_attributes = array_merge( $story_attributes, $this->get_mapped_field_states() );

			return ( new Story_Query( $story_attributes, $this->get_query_args() ) )->render();
		}

		// Embedding a single story by URL.
		$attributes = wp_parse_args( $attributes, $this->default_attrs() );

		$attributes['class'] = 'wp-block-web-stories-embed';

		return $this->render( $attributes );
	}

	/**
	 * Maps fields to the story params.
	 *
	 * @since 1.5.0
	 *
	 * @return array<string, mixed>
	 */
	public function get_mapped_field_states(): array {
		$controls = [
			'show_title'        => 'title',
			'show_author'       => 'author',
			'show_excerpt'      => 'excerpt',
			'show_date'         => 'date',
			'show_archive_link' => 'archive_link',
			'sharp_corners'     => 'sharp_corners',
		];

		$controls_state = [];

		foreach ( $controls as $control => $field ) {
			$key = 'show_' . $field;

			$controls_state[ $control ] = $this->block_attributes['fieldState'][ $key ] ?? false;
		}

		return $controls_state;
	}

	/**
	 * Registers a block type from metadata stored in the `block.json` file.
	 *
	 * @since 1.9.0
	 */
	protected function register_block_type(): void {
		$base_path = $this->assets->get_base_path( 'blocks/embed/block.json' );
		// Note: does not use 'script' and 'style' args, and instead uses 'render_callback'
		// to enqueue these assets only when needed.
		register_block_type_from_metadata(
			$base_path,
			[
				'attributes'      => [
					'blockType'        => [
						'type' => 'string',
					],
					'url'              => [
						'type' => 'string',
					],
					'title'            => [
						'type'    => 'string',
						'default' => __( 'Web Story', 'web-stories' ),
					],
					'poster'           => [
						'type' => 'string',
					],
					'width'            => [
						'type'    => 'number',
						'default' => 360,
					],
					'height'           => [
						'type'    => 'number',
						'default' => 600,
					],
					'align'            => [
						'type'    => 'string',
						'default' => 'none',
					],
					'stories'          => [
						'type'    => 'array',
						'default' => [],
					],
					'viewType'         => [
						'type'    => 'string',
						'default' => '',
					],
					'numOfStories'     => [
						'type'    => 'number',
						'default' => 5,
					],
					'numOfColumns'     => [
						'type'    => 'number',
						'default' => 2,
					],
					'circleSize'       => [
						'type'    => 'number',
						'default' => 96,
					],
					'imageAlignment'   => [
						'type'    => 'number',
						'default' => 96,
					],
					'orderby'          => [
						'type'    => 'string',
						'default' => '',
					],
					'order'            => [
						'type'    => 'string',
						'default' => '',
					],
					'archiveLinkLabel' => [
						'type'    => 'string',
						'default' => __( 'View all stories', 'web-stories' ),
					],
					'authors'          => [
						'type'    => 'array',
						'default' => [],
					],
					'fieldState'       => [
						'type'    => 'object',
						'default' => [],
					],
				],
				'render_callback' => [ $this, 'render_block' ],
				'editor_script'   => self::SCRIPT_HANDLE,
				'editor_style'    => self::SCRIPT_HANDLE,
			]
		);
	}

	/**
	 * Returns script settings.
	 *
	 * @since 1.5.0
	 *
	 * @return array<string, mixed> Script settings.
	 */
	private function get_script_settings(): array {
		$settings = [
			'publicPath' => $this->assets->get_base_url( 'assets/js/' ),
			'config'     => [
				'maxNumOfStories' => self::MAX_NUM_OF_STORIES,
				'archiveURL'      => get_post_type_archive_link( $this->story_post_type->get_slug() ),
				'api'             => [
					'stories' => trailingslashit( $this->story_post_type->get_rest_url() ),
					'users'   => '/web-stories/v1/users/',
				],
				'fieldStates'     => $this->stories_script_data->fields_states(),
			],
		];

		/**
		 * Filters settings passed to the web stories block.
		 *
		 * @param array<string, mixed> $settings Array of settings passed to web stories block.
		 */
		return apply_filters( 'web_stories_block_settings', $settings );
	}

	/**
	 * Initializes class variable $block_attributes.
	 *
	 * @since 1.5.0
	 *
	 * @param array $block_attributes Array containing block attributes.
	 * @return bool Whether or not block attributes have been initialized with given value.
	 *
	 * @phpstan-param BlockAttributes $block_attributes
	 */
	protected function initialize_block_attributes( array $block_attributes = [] ): bool {
		if ( ! empty( $block_attributes ) ) {
			$this->block_attributes = $block_attributes;
			return true;
		}
		return false;
	}

	/**
	 * Returns arguments to be passed to the WP_Query object initialization.
	 *
	 * @SuppressWarnings("PHPMD.NPathComplexity")
	 *
	 * @since 1.5.0
	 *
	 * @return array<string, mixed> Query arguments.
	 */
	protected function get_query_args(): array {
		$attributes = $this->block_attributes;

		$query_args = [
			'post_type'        => $this->story_post_type->get_slug(),
			'post_status'      => 'publish',
			'suppress_filters' => false,
			'no_found_rows'    => true,
		];

		if ( ! empty( $attributes['taxQuery'] ) ) {
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
			$query_args['tax_query'] = [];
			foreach ( $attributes['taxQuery'] as $taxonomy => $terms ) {
				if ( is_taxonomy_viewable( $taxonomy ) && ! empty( $terms ) ) {
					// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					$query_args['tax_query'][] = [
						'taxonomy'         => $taxonomy,
						'terms'            => array_filter( array_map( '\intval', $terms ) ),
						'include_children' => false,
					];
				}
			}
		}

		// if block type is 'selected-tories'.
		if ( ! empty( $attributes['blockType'] )
			&& 'selected-stories' === $attributes['blockType']
			&& ! empty( $attributes['stories'] )
		) {
			$query_args['post__in'] = $attributes['stories'];
			$query_args['orderby']  = 'post__in';

			return $query_args;
		}

		if ( ! empty( $attributes['numOfStories'] ) ) {
			$query_args['posts_per_page'] = $attributes['numOfStories'];
		}

		if ( ! empty( $attributes['order'] ) ) {
			$query_args['order'] = strtoupper( $attributes['order'] );
		}

		if ( ! empty( $attributes['orderby'] ) ) {
			$query_args['orderby'] = 'title' === $attributes['orderby'] ? 'post_title' : 'post_date';
		}

		if ( ! empty( $attributes['authors'] ) ) {
			$query_args['author__in'] = $attributes['authors'];
		}

		return $query_args;
	}
}
