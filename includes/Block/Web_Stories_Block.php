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

namespace Google\Web_Stories\Block;

use Google\Web_Stories\AMP_Story_Player_Assets;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Context;
use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Stories_Script_Data;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Story_Query;
use Google\Web_Stories\Tracking;

/**
 * Latest Stories block class.
 */
class Web_Stories_Block extends Embed_Base {

	/**
	 * Script handle.
	 */
	public const SCRIPT_HANDLE = 'web-stories-block';

	/**
	 * Current block's block attributes.
	 *
	 * @var array Block Attributes.
	 */
	protected $block_attributes = [];

	/**
	 * Maximum number of stories users can select
	 */
	public const MAX_NUM_OF_STORIES = 20;

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	protected $story_post_type;

	/**
	 * Stories_Script_Data instance.
	 *
	 * @var Stories_Script_Data Stories_Script_Data instance.
	 */
	protected $stories_script_data;

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
	 * @return array Script settings.
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
		 * @param array $settings Array of settings passed to web stories block.
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
	 */
	protected function initialize_block_attributes( array $block_attributes = [] ): bool {
		if ( ! empty( $block_attributes ) && \is_array( $block_attributes ) ) {
			$this->block_attributes = $block_attributes;
			return true;
		}
		return false;
	}

	/**
	 * Renders the block type output for given attributes.
	 *
	 * @since 1.5.0
	 *
	 * @param array $attributes Block attributes.
	 * @return string Rendered block type output.*
	 */
	public function render_block( array $attributes ): string {

		if ( false === $this->initialize_block_attributes( $attributes ) ) {
			return '';
		}

		if ( ! empty( $attributes['blockType'] )
			&& ( 'latest-stories' === $attributes['blockType'] || 'selected-stories' === $attributes['blockType'] ) ) {

			$story_attributes = [
				'align'              => $attributes['align'],
				'view_type'          => $attributes['viewType'],
				'archive_link_label' => $attributes['archiveLinkLabel'],
				'circle_size'        => $attributes['circleSize'],
				'image_alignment'    => $attributes['imageAlignment'],
				'number_of_columns'  => $attributes['numOfColumns'],
			];

			$story_attributes = array_merge( $story_attributes, $this->get_mapped_field_states() );

			$stories = new Story_Query( $story_attributes, $this->get_query_args() );

			return $stories->render();
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
	 * @return array
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
	 * Returns arguments to be passed to the WP_Query object initialization.
	 *
	 * @since 1.5.0
	 *
	 * @return array Query arguments.
	 */
	protected function get_query_args(): array {

		$attributes = $this->block_attributes;

		$query_args = [
			'post_type'        => $this->story_post_type->get_slug(),
			'post_status'      => 'publish',
			'suppress_filters' => false,
			'no_found_rows'    => true,
		];

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

		$query_args['order']   = strtoupper( $attributes['order'] );
		$query_args['orderby'] = 'title' === $attributes['orderby'] ? 'post_title' : 'post_date';

		if ( ! empty( $attributes['authors'] ) && \is_array( $attributes['authors'] ) ) {
			$query_args['author__in'] = $attributes['authors'];
		}

		return $query_args;
	}
}
