<?php
/**
 * Class Embed_Block.
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

namespace Google\Web_Stories;

use Google\Web_Stories\Model\Story;
use Google\Web_Stories\Renderer\Story\Embed;
use Google\Web_Stories\Renderer\Story\Image;
use Google\Web_Stories\Renderer\Story\Singleton;

/**
 * Embed block class.
 */
abstract class Embed_Base extends Service_Base {
	/**
	 * Script handle for frontend assets.
	 */
	public const SCRIPT_HANDLE = 'web-stories-embed';

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	protected Assets $assets;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	protected Context $context;

	/**
	 * Embed Base constructor.
	 *
	 * @since 1.8.0
	 *
	 * @param Assets  $assets  Assets instance.
	 * @param Context $context Context instance.
	 */
	public function __construct( Assets $assets, Context $context ) {
		$this->assets  = $assets;
		$this->context = $context;
	}

	/**
	 * Initializes the Web Stories embed block.
	 *
	 * @since 1.1.0
	 */
	public function register(): void {
		if ( wp_style_is( self::SCRIPT_HANDLE, 'registered' ) ) {
			return;
		}

		$this->assets->register_style_asset( self::SCRIPT_HANDLE );

		if ( \defined( 'AMPFORWP_VERSION' ) ) {
			add_action( 'amp_post_template_css', [ $this, 'add_amp_post_template_css' ] );
		}

		add_filter( 'wp_kses_allowed_html', [ $this, 'filter_kses_allowed_html' ] );
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int {
		return 11;
	}

	/**
	 * Prints required inline CSS when using the AMP for WP plugin.
	 *
	 * @since 1.13.0
	 */
	public function add_amp_post_template_css(): void {
		$path = $this->assets->get_base_path( sprintf( 'assets/css/%s%s.css', self::SCRIPT_HANDLE, is_rtl() ? '-rtl' : '' ) );

		if ( is_readable( $path ) ) {
			$css = file_get_contents( $path ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
			echo $css; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}

	/**
	 * Filter the allowed tags for KSES to allow for amp-story children.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string, array<string,bool>>|mixed $allowed_tags Allowed tags.
	 * @return array<string, array<string,bool>>|mixed Allowed tags.
	 *
	 * @template T
	 *
	 * @phpstan-return ($allowed_tags is array<T> ? array<T> : mixed)
	 */
	public function filter_kses_allowed_html( $allowed_tags ) {
		if ( ! \is_array( $allowed_tags ) ) {
			return $allowed_tags;
		}

		$story_player_components = [
			'amp-story-player' => [],
		];

		$allowed_tags = array_merge( $allowed_tags, $story_player_components );

		return $allowed_tags;
	}

	/**
	 * Renders a story with given attributes.
	 *
	 * @since 1.30.0
	 *
	 * @param Story                     $story      Story instance.
	 * @param array<string, string|int> $attributes Embed render attributes.
	 * @return string Rendered embed output.
	 */
	public function render_story( Story $story, array $attributes ): string {
		if ( is_feed() ) {
			$renderer = new Image( $story );
		} elseif ( ! empty( $attributes['previewOnly'] ) ) {
			$renderer = new Singleton( $story, $this->assets );
		} else {
			$renderer = new Embed( $story, $this->assets, $this->context );
		}

		return $renderer->render( $attributes );
	}

	/**
	 * Renders an embed with given attributes.
	 *
	 * @since 1.1.0
	 *
	 * @param array<string, string|int> $attributes Embed render attributes.
	 * @return string Rendered embed output.
	 */
	public function render( array $attributes ): string {
		// The only mandatory attribute.
		if ( empty( $attributes['url'] ) && empty( $attributes['previewOnly'] ) ) {
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

		return $this->render_story( $story, $attributes );
	}

	/**
	 * Return an array of default attributes.
	 *
	 * @since 1.1.0
	 *
	 * @return array<string, string|int> Default attributes.
	 */
	protected function default_attrs(): array {
		$attrs = [
			'align'       => 'none',
			'height'      => 600,
			'poster'      => '',
			'url'         => '',
			'title'       => '',
			'width'       => 360,
			'previewOnly' => false,
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

}
