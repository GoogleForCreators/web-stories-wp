<?php
/**
 * TinyMCE Class.
 *
 * Necessary operations for classic editor compatibility.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2021 Google LLC
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

use Google\Web_Stories\Assets;
use Google\Web_Stories\Context;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Stories_Script_Data;

/**
 * Class TinyMCE
 */
class TinyMCE extends Service_Base {
	/**
	 * Web Stories tinymce script handle.
	 */
	public const SCRIPT_HANDLE = 'web-stories-tinymce-button';

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private Assets $assets;

	/**
	 * Stories_Script_Data instance.
	 *
	 * @var Stories_Script_Data Stories_Script_Data instance.
	 */
	protected Stories_Script_Data $stories_script_data;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private Context $context;

	/**
	 * Tinymce constructor.
	 *
	 * @since 1.8.0
	 *
	 * @param Assets              $assets              Assets instance.
	 * @param Stories_Script_Data $stories_script_data Stories_Script_Data instance.
	 * @param Context             $context             Context instance.
	 */
	public function __construct( Assets $assets, Stories_Script_Data $stories_script_data, Context $context ) {
		$this->assets              = $assets;
		$this->stories_script_data = $stories_script_data;
		$this->context             = $context;
	}

	/**
	 * Initialization actions.
	 *
	 * @since 1.5.0
	 */
	public function register(): void {
		if ( $this->context->is_block_editor() || $this->context->is_story_editor() ) {
			return;
		}

		$this->register_assets();

		add_action( 'wp_enqueue_editor', [ $this, 'enqueue_assets' ] );
		add_filter( 'mce_buttons', [ $this, 'tinymce_web_stories_button' ] );
		add_filter( 'mce_external_plugins', [ $this, 'web_stories_mce_plugin' ] );
		add_action( 'admin_footer', [ $this, 'web_stories_tinymce_root_element' ] );
		add_filter( 'script_loader_tag', [ $this, 'script_loader_tag' ], 10, 3 );
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'admin_enqueue_scripts';
	}

	/**
	 * Add web stories button in TinyMCE editor.
	 *
	 * @since 1.5.0
	 *
	 * @param array|mixed $buttons Array of TinyMCE buttons.
	 * @return array|mixed
	 *
	 * @template T
	 *
	 * @phpstan-return ($buttons is array<T> ? array<T> : mixed)
	 */
	public function tinymce_web_stories_button( $buttons ) {
		if ( ! \is_array( $buttons ) ) {
			return $buttons;
		}
		$buttons[] = 'web_stories';

		return $buttons;
	}

	/**
	 * Register web stories plugin for tinycemce editor.
	 *
	 * @since 1.5.0
	 *
	 * @param array|mixed $plugins Array of TinyMCE plugin scripts.
	 * @return array|mixed
	 *
	 * @template T
	 *
	 * @phpstan-return ($plugins is array<T> ? array<T> : mixed)
	 */
	public function web_stories_mce_plugin( $plugins ) {
		if ( ! \is_array( $plugins ) ) {
			return $plugins;
		}
		$plugins['web_stories'] = $this->assets->get_base_url( \sprintf( 'assets/js/%s.js', self::SCRIPT_HANDLE ) );

		return $plugins;
	}

	/**
	 * Enqueue related scripts.
	 *
	 * @since 1.5.0
	 */
	public function register_assets(): void {
		$this->assets->enqueue_style( 'wp-components' );

		$this->assets->enqueue_script_asset( self::SCRIPT_HANDLE );
		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesData',
			$this->stories_script_data->get_script_data()
		);
	}

	/**
	 * Hijack the button's script to render an empty script tag.
	 *
	 * @since 1.5.0
	 *
	 * @param string|mixed $tag    The `<script>` tag for the enqueued script.
	 * @param string       $handle The script's registered handle.
	 * @param string       $src    The script's source URL.
	 * @return string|mixed The filtered script tag.
	 */
	public function script_loader_tag( $tag, string $handle, string $src ) {
		if ( ! \is_string( $tag ) ) {
			return $tag;
		}

		if ( self::SCRIPT_HANDLE === $handle ) {
			$tag = str_replace( $src, '', $tag );
			// phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- False positive.
			$tag = (string) preg_replace( '#<script src=\'\'(.*?)>(.*?)</script>#is', '', $tag );
		}

		return $tag;
	}

	/**
	 * Enqueue related scripts.
	 *
	 * @since 1.5.0
	 */
	public function enqueue_assets(): void {
		$this->assets->enqueue_style( 'wp-components' );
		$this->assets->enqueue_script_asset( self::SCRIPT_HANDLE );
	}

	/**
	 * Root element for tinymce editor.
	 * This is useful for performing some react operations.
	 *
	 * @since 1.5.0
	 */
	public function web_stories_tinymce_root_element(): void {
		?>
		<div id="web-stories-tinymce"></div>
		<?php
	}
}
