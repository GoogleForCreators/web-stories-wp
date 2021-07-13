<?php
/**
 * Class Embed_Block.
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

namespace Google\Web_Stories;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\Image;
use Google\Web_Stories\Renderer\Story\Embed;

/**
 * Embed block class.
 */
abstract class Embed_Base extends Service_Base {

	/**
	 * Script handle for frontend assets.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'web-stories-embed';

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	protected $assets;

	/**
	 * AMP_Story_Player_Assets instance.
	 *
	 * @var AMP_Story_Player_Assets AMP_Story_Player_Assets instance.
	 */
	protected $amp_story_player_assets;

	/**
	 * Embed Base constructor.
	 *
	 * @since 1.8.0
	 *
	 * @param Assets                  $assets            Assets instance.
	 * @param AMP_Story_Player_Assets $amp_story_player_assets AMP_Story_Player_Assets instance.
	 */
	public function __construct( Assets $assets, AMP_Story_Player_Assets $amp_story_player_assets ) {
		$this->assets                  = $assets;
		$this->amp_story_player_assets = $amp_story_player_assets;
	}

	/**
	 * Initializes the Web Stories embed block.
	 *
	 * @since 1.1.0
	 *
	 * @return void
	 */
	public function register() {
		$this->assets->register_style_asset( self::SCRIPT_HANDLE );
		// Set a style without a `src` allows us to just use the inline style below
		// without needing an external stylesheet.
		wp_styles()->registered[ self::SCRIPT_HANDLE ]->src = false;

		$path = $this->assets->get_base_path( sprintf( 'assets/css/%s.css', self::SCRIPT_HANDLE ) );
		if ( is_rtl() ) {
			$path = $this->assets->get_base_path( sprintf( 'assets/css/%s-rtl.css', self::SCRIPT_HANDLE ) );
		}

		if ( is_readable( $path ) ) {
			$css = file_get_contents( $path ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown

			if ( $css ) {
				wp_add_inline_style( self::SCRIPT_HANDLE, $css );
			}
		}

		add_filter( 'wp_kses_allowed_html', [ $this, 'filter_kses_allowed_html' ], 10, 2 );
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority() {
		return 11;
	}

	/**
	 * Filter the allowed tags for KSES to allow for amp-story children.
	 *
	 * @since 1.0.0
	 *
	 * @param array|string $allowed_tags Allowed tags.
	 *
	 * @return array|string Allowed tags.
	 */
	public function filter_kses_allowed_html( $allowed_tags ) {
		if ( ! is_array( $allowed_tags ) ) {
			return $allowed_tags;
		}

		$story_player_components = [
			'amp-story-player' => [],
		];

		$allowed_tags = array_merge( $allowed_tags, $story_player_components );

		return $allowed_tags;
	}

	/**
	 * Return an array of default attributes.
	 *
	 * @since 1.1.0
	 *
	 * @return array
	 */
	protected function default_attrs() {
		$attrs = [
			'align'  => 'none',
			'height' => 600,
			'poster' => '',
			'url'    => '',
			'title'  => '',
			'width'  => 360,
		];

		/**
		 * Filters settings passed to the web stories embed.
		 *
		 * @since 1.1.0
		 *
		 * @param array $attrs Array of settings passed to web stories embed.
		 */
		return apply_filters( 'web_stories_embed_default_attributes', $attrs );
	}

	/**
	 * Renders an embed with given attributes.
	 *
	 * @since 1.1.0
	 *
	 * @param array $attributes Embed render attributes.
	 *
	 * @return string Rendered embed output.
	 */
	public function render( array $attributes ) {
		// The only mandatory attribute.
		if ( empty( $attributes['url'] ) ) {
			return '';
		}

		if ( empty( $attributes['title'] ) ) {
			$attributes['title'] = __( 'Web Story', 'web-stories' );
		}

		$data = [
			'title'           => $attributes['title'],
			'url'             => $attributes['url'],
			'poster_portrait' => $attributes['poster'],
		];

		$story = new Story( $data );

		if ( is_feed() ) {
			$renderer = new Image( $story );
		} else {
			$renderer = new Embed( $story, $this->assets, $this->amp_story_player_assets );
		}

		return $renderer->render( $attributes );
	}

}
