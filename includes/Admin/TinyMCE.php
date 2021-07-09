<?php
/**
 * TinyMCE Class.
 *
 * Necessary operations for classic editor compatibility.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\{Service_Base,Assets};
use Google\Web_Stories\Traits\{Screen,Stories_Script_Data};

/**
 * Class TinyMCE
 *
 * @package Google\Web_Stories
 */
class TinyMCE extends Service_Base {
	use Stories_Script_Data, Screen;

	/**
	 * Web Stories tinymce script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'tinymce-button';

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private $assets;

	/**
	 * Tinymce constructor.
	 *
	 * @since 1.8.0
	 *
	 * @param Assets $assets Assets instance.
	 */
	public function __construct( Assets $assets ) {
		$this->assets = $assets;
	}

	/**
	 * Initialization actions.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function register() {
		if ( $this->is_block_editor() || $this->is_edit_screen() ) {
			return;
		}

		$this->register_assets();

		add_action( 'wp_enqueue_editor', [ $this, 'enqueue_assets' ] );
		add_filter( 'mce_buttons', [ $this, 'tinymce_web_stories_button' ] );
		add_filter( 'mce_external_plugins', [ $this, 'web_stories_mce_plugin' ] );
		add_action( 'admin_footer', [ $this, 'web_stories_tinymce_root_element' ] );
		add_action( 'script_loader_tag', [ $this, 'script_loader_tag' ], 10, 3 );
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
	 * @param array $buttons Array of TinyMCE buttons.
	 *
	 * @return array
	 */
	public function tinymce_web_stories_button( array $buttons ): array {
		$buttons[] = 'web_stories';

		return $buttons;
	}

	/**
	 * Register web stories plugin for tinycemce editor.
	 *
	 * @since 1.5.0
	 *
	 * @param array $plugins Array of TinyMCE plugin scripts.
	 *
	 * @return array
	 */
	public function web_stories_mce_plugin( array $plugins ): array {

		$plugins['web_stories'] = trailingslashit( WEBSTORIES_PLUGIN_DIR_URL ) . 'assets/js/tinymce-button.js';

		return $plugins;
	}

	/**
	 * Enqueue related scripts.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function register_assets() {
		$this->assets->enqueue_style( 'wp-components' );

		$this->assets->enqueue_script_asset( self::SCRIPT_HANDLE );
		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesData',
			$this->get_script_data()
		);
	}

	/**
	 * High jack the tinymce to render an empty script tag for tinymce.
	 *
	 * @since 1.5.0
	 *
	 * @param string $tag    The `<script>` tag for the enqueued script.
	 * @param string $handle The script's registered handle.
	 * @param string $src    The script's source URL.
	 *
	 * @return string $tag The `<script>` tag for the enqueued script.
	 */
	public function script_loader_tag( $tag, $handle, $src ) {
		if ( self::SCRIPT_HANDLE === $handle ) {
			$tag = str_replace( $src, '', $tag );
			$tag = (string) preg_replace( '#<script src=\'\'(.*?)>(.*?)</script>#is', '', $tag );
		}

		return $tag;
	}

	/**
	 * Enqueue related scripts.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$this->assets->enqueue_style( 'wp-components' );
		$this->assets->enqueue_script_asset( self::SCRIPT_HANDLE );
	}

	/**
	 * Root element for tinymce editor.
	 * This is useful for performing some react operations.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function web_stories_tinymce_root_element() {
		?>
		<div id="web-stories-tinymce"></div>
		<?php
	}
}
