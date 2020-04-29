<?php
/**
 * Dashboard class.
 *
 * Responsible for adding the stories dashboard to WordPress admin.
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

/**
 * Dashboard class.
 */
class Dashboard {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'stories-dashboard';

	/**
	 * Admin page hook suffix.
	 *
	 * @var string|false The dashboard page's hook_suffix, or false if the user does not have the capability required.
	 */
	private $hook_suffix;

	/**
	 * Initializes the dashboard logic.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Returns the admin page's hook suffix.
	 *
	 * @return string|false The dashboard page's hook_suffix, or false if the user does not have the capability required.
	 */
	public function get_hook_suffix() {
		return $this->hook_suffix;
	}

	/**
	 * Registers the dashboard admin menu page.
	 *
	 * @return void
	 */
	public function add_menu_page() {
		$this->hook_suffix = add_submenu_page(
			'edit.php?post_type=' . Story_Post_Type::POST_TYPE_SLUG,
			__( 'Dashboard', 'web-stories' ),
			__( 'Dashboard', 'web-stories' ),
			'edit_posts',
			'stories-dashboard',
			[ $this, 'render' ],
			0
		);
	}

	/**
	 * Renders the dashboard page.
	 *
	 * @return void
	 */
	public function render() {
		?>
		<div id="web-stories-dashboard">
			<h1 class="loading-message"><?php esc_html_e( 'Please wait...', 'web-stories' ); ?></h1>
		</div>
		<?php
	}

	/**
	 * Enqueues dashboard scripts and styles.
	 *
	 * @param string $hook_suffix The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_assets( $hook_suffix ) {
		if ( $this->hook_suffix !== $hook_suffix ) {
			return;
		}

		$asset_file   = WEBSTORIES_PLUGIN_DIR_PATH . 'assets/js/' . self::SCRIPT_HANDLE . '.asset.php';
		$asset        = is_readable( $asset_file ) ? require $asset_file : [];
		$dependencies = isset( $asset['dependencies'] ) ? $asset['dependencies'] : [];
		$version      = isset( $asset['version'] ) ? $asset['version'] : WEBSTORIES_VERSION;

		wp_enqueue_script(
			self::SCRIPT_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/js/' . self::SCRIPT_HANDLE . '.js',
			$dependencies,
			$version,
			false
		);

		wp_set_script_translations( self::SCRIPT_HANDLE, 'web-stories' );

		$rest_base     = Story_Post_Type::POST_TYPE_SLUG;
		$new_story_url = admin_url(
			add_query_arg(
				[
					'post_type' => Story_Post_Type::POST_TYPE_SLUG,
				],
				'post-new.php'
			)
		);

		$edit_story_url = admin_url(
			add_query_arg(
				[
					'action' => 'edit',
				],
				'post.php'
			)
		);

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesDashboardSettings',
			[
				'id'     => 'web-stories-dashboard',
				'config' => [
					'isRTL'        => is_rtl(),
					'newStoryURL'  => $new_story_url,
					'editStoryURL' => $edit_story_url,
					'pluginDir'    => WEBSTORIES_PLUGIN_DIR_URL,
					'version'      => WEBSTORIES_VERSION,
					'api'          => [
						'stories' => sprintf( '/wp/v2/%s', $rest_base ),
						'fonts'   => '/web-stories/v1/fonts',
					],
				],
			]
		);

		wp_register_style(
			'google-sans-font',
			'https://fonts.googleapis.com/css?family=Google+Sans|Google+Sans:b|Google+Sans:500',
			[],
			WEBSTORIES_VERSION
		);

		wp_enqueue_style(
			self::SCRIPT_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/css/' . self::SCRIPT_HANDLE . '.css',
			[ 'google-sans-font' ],
			$version
		);

		// Dequeue forms.css, see https://github.com/google/web-stories-wp/issues/349 .
		wp_styles()->registered['wp-admin']->deps = array_diff(
			wp_styles()->registered['wp-admin']->deps,
			[ 'forms' ]
		);
	}
}
