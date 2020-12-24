<?php
/**
 * Class Web_Stories_Block.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

use Google\Web_Stories\Embed_Base;
use Google\Web_Stories\Story_Query;
use Google\Web_Stories\Tracking;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Traits\Assets;

/**
 * Latest Stories block class.
 */
class Web_Stories_Block {
	use Assets;

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'web-stories-block';

	/**
	 * Block name.
	 *
	 * @var string
	 */
	const BLOCK_NAME = 'web-stories/list';

	/**
	 * Current block's block attributes.
	 *
	 * @var array Block Attributes.
	 */
	protected $block_attributes = [];

	/**
	 * Maximum number of stories users can select
	 *
	 * @var int
	 */
	protected $max_num_of_stories = 20;

	/**
	 * Initializes the Web Stories embed block.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function init() {
		$this->register_script( self::SCRIPT_HANDLE, [ Embed_Base::STORY_PLAYER_HANDLE, Tracking::SCRIPT_HANDLE ] );
		$this->register_style( self::SCRIPT_HANDLE );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesBlockSettings',
			$this->get_script_settings()
		);

		// Note: does not use 'script' and 'style' args, and instead uses 'render_callback'
		// to enqueue these assets only when needed.
		register_block_type(
			self::BLOCK_NAME,
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
					'sizeOfCircles'    => [
						'type'    => 'number',
						'default' => 96,
					],
					'orderByValue'     => [
						'type'    => 'string',
						'default' => '',
					],
					'viewAllLinkLabel' => [
						'type'    => 'string',
						'default' => __( 'View all stories', 'web-stories' ),
					],
					'authors'          => [
						'type'    => 'array',
						'default' => [],
					],
					'fieldState'       => [
						'type'    => 'object',
						'default' => $this->fields_states(),
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
	 * @since 1.3.0
	 *
	 * @return array Script settings.
	 */
	private function get_script_settings() {
		$rest_base = Story_Post_Type::POST_TYPE_SLUG;

		$edit_story_url = admin_url(
			add_query_arg(
				[
					'action' => 'edit',
				],
				'post.php'
			)
		);

		$settings = [
			'publicPath' => WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/',
			'config'     => [
				'maxNumOfStories' => $this->max_num_of_stories,
				'editStoryURL'    => $edit_story_url,
				'api'             => [
					'stories' => sprintf( '/web-stories/v1/%s', $rest_base ),
					'users'   => '/web-stories/v1/users/',
				],
				'fieldStates'     => $this->fields_states(),
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
	 * @since 1.3.0
	 *
	 * @param array $block_attributes Array containing block attributes.
	 *
	 * @return bool Whether or not block attributes have been initialized with given value.
	 */
	protected function initialize_block_attributes( $block_attributes = [] ) {
		if ( ! empty( $block_attributes ) || ! is_array( $block_attributes ) ) {
			$this->block_attributes = $block_attributes;
			return true;
		}
		return false;
	}

	/**
	 * Renders the block type output for given attributes.
	 *
	 * @since 1.3.0
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return string Rendered block type output.*
	 */
	public function render_block( array $attributes ) {

		if ( false === $this->initialize_block_attributes( $attributes ) ) {
			return '';
		}

		if ( ! empty( $attributes['blockType'] )
			&& ( 'latest-stories' === $attributes['blockType'] || 'selected-stories' === $attributes['blockType'] ) ) {

			$story_attributes = [
				'align'                 => $attributes['align'],
				'view_type'             => ! empty( $attributes['viewType'] ) ? $attributes['viewType'] : 'grid',
				'number_of_columns'     => $attributes['numOfColumns'],
				'stories_archive_label' => $attributes['viewAllLinkLabel'],
				'circle_size'           => $attributes['sizeOfCircles'],
			];

			$story_attributes = array_merge( $story_attributes, $this->get_mapped_field_states( $attributes ) );

			$stories = new Story_Query( $story_attributes, $this->get_query_args() );

			return $stories->render();
		}

		$embed_block = new Embed_Base();

		return $embed_block->render( $attributes );
	}

	/**
	 * Get the field value.
	 *
	 * @since 1.3.0
	 *
	 * @param string $field     Field name to get the value of.
	 * @param string $view_type View type to get the field from.
	 *
	 * @return boolean
	 */
	public function get_field_state( $field, $view_type ) {
		return $this->block_attributes['fieldState'][ $view_type ][ $field ]['show'];
	}

	/**
	 * Maps fields to the story params.
	 *
	 * @since 1.3.0
	 *
	 * @param array $attributes Block Attributes.
	 *
	 * @return array
	 */
	public function get_mapped_field_states( $attributes ) {
		$controls = [
			'show_title'                => 'title',
			'show_excerpt'              => 'excerpt',
			'show_date'                 => 'date',
			'show_author'               => 'author',
			'show_stories_archive_link' => 'archive_link',
			'list_view_image_alignment' => 'image_align',
			'has_square_corners'        => 'sharp_corners',
		];

		$controls_state = [];

		foreach ( $controls as $control => $field ) {
			$controls_state[ $control ] = $this->get_field_state( $field, $attributes['viewType'] );
		}

		return $controls_state;
	}

	/**
	 * Returns arguments to be passed to the WP_Query object initialization.
	 *
	 * @since 1.3.0
	 *
	 * @param array $attributes Current block's attributes. If not passed,
	 *                          will use attributes stored in class variable.
	 *
	 * @return array Query arguments.
	 */
	protected function get_query_args( array $attributes = [] ) {

		if ( empty( $attributes ) ) {
			$attributes = $this->block_attributes;
		}

		if ( empty( $attributes ) ) {
			return [];
		}

		$query_args = [
			'post_type'        => Story_Post_Type::POST_TYPE_SLUG,
			'post_status'      => 'publish',
			'suppress_filters' => false,
			'no_found_rows'    => true,
		];

		// if block type is 'selected-webstories'.
		if ( ! empty( $attributes['blockType'] )
			&& 'selected-stories' === $attributes['blockType']
		) {
			// if no stories are selected return empty array.
			if ( empty( $attributes['stories'] ) ) {
				return [];
			}

			$query_args['post__in'] = $attributes['stories'];
			$query_args['orderby']  = 'post__in';

			return $query_args;
		}

		$order_by_value = ( ! empty( $attributes['orderByValue'] ) ) ? $attributes['orderByValue'] : '';
		$num_of_stories = ( ! empty( $attributes['numOfStories'] ) ) ? absint( $attributes['numOfStories'] ) : '';

		if ( ! empty( $num_of_stories ) ) {
			$query_args['posts_per_page'] = $num_of_stories;
		}

		if ( ! empty( $order_by_value ) ) {
			switch ( $order_by_value ) {
				case 'old-to-new':
					$query_args['order'] = 'ASC';
					break;
				case 'alphabetical':
					$query_args['orderby'] = 'title';
					$query_args['order']   = 'ASC';
					break;
				case 'reverse-alphabetical':
					$query_args['orderby'] = 'title';
					$query_args['order']   = 'DESC';
					break;
			}
		}

		if ( ! empty( $attributes['authors'] ) && is_array( $attributes['authors'] ) ) {
			$author_ids = wp_list_pluck( $attributes['authors'], 'id' );

			if ( ! empty( $author_ids ) && is_array( $author_ids ) ) {
				$query_args['author__in'] = $author_ids;
			}
		}

		return $query_args;
	}

	/**
	 * Wrapper function for fetching field states
	 * based on the view types.
	 *
	 * Mainly uses FieldState and Fields classes.
	 *
	 * @since 1.3.0
	 *
	 * @return array
	 */
	protected function fields_states() {
		$views = [
			'circles'  => __( 'Circles', 'web-stories' ),
			'grid'     => __( 'Grid', 'web-stories' ),
			'list'     => __( 'List', 'web-stories' ),
			'carousel' => __( 'Carousel', 'web-stories' ),
		];

		$fields = [
			'title',
			'excerpt',
			'author',
			'date',
			'image_align',
			'sharp_corners',
			'archive_link',
		];

		$field_states = [];

		foreach ( $views as $view_type => $view_label ) {
			$field_state = ( new Story_Query( [ 'view_type' => $view_type ] ) )->get_renderer()->field();
			foreach ( $fields as $field ) {
				$field_states[ $view_type ][ $field ] = [
					'show'     => $field_state->$field()->show(),
					'label'    => $field_state->$field()->label(),
					'readonly' => $field_state->$field()->readonly(),
				];
			}
		}

		return $field_states;
	}
}
