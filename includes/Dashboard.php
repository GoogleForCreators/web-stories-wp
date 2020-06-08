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

use WP_Screen;

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
		add_action( 'admin_notices', [ $this, 'display_link_to_dashboard' ] );
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

		$classic_wp_list_url = admin_url(
			add_query_arg(
				[
					'post_type' => 'web-story',
				],
				'edit.php'
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
					'wpListURL'    => $classic_wp_list_url,
					'assetsURL'    => WEBSTORIES_ASSETS_URL,
					'version'      => WEBSTORIES_VERSION,
					'api'          => [
						'stories' => sprintf( '/wp/v2/%s', $rest_base ),
						'users'   => '/wp/v2/users',
						'fonts'   => '/web-stories/v1/fonts',
					],
				],
				'flags'  => [
					/**
					 * Description: Enables user facing animations.
					 * Author: @littlemilkstudio
					 * Issue: 1897
					 * Creation date: 2020-05-21
					 */
					'enableAnimation'       => false,
					/**
					 * Description: Enables in-progress views to be accessed.
					 * Author: @carlos-kelly
					 * Issue: 2081
					 * Creation date: 2020-05-28
					 */
					'enableInProgressViews' => false,
				],
			]
		);

		wp_register_style(
			'google-fonts',
			'https://fonts.googleapis.com/css?family=Google+Sans|Google+Sans:b|Google+Sans:500|Roboto:400',
			[],
			WEBSTORIES_VERSION
		);

		wp_enqueue_style(
			self::SCRIPT_HANDLE,
			WEBSTORIES_PLUGIN_DIR_URL . 'assets/css/' . self::SCRIPT_HANDLE . '.css',
			[ 'google-fonts' ],
			$version
		);

		// Dequeue forms.css, see https://github.com/google/web-stories-wp/issues/349 .
		wp_styles()->registered['wp-admin']->deps = array_diff(
			wp_styles()->registered['wp-admin']->deps,
			[ 'forms' ]
		);
	}

	/**
	 * Displays a link to the Web Stories dashboard on the WordPress list table view.
	 *
	 * @return void
	 */
	public function display_link_to_dashboard() {
		$screen = get_current_screen();

		if ( ! $screen instanceof WP_Screen ) {
			return;
		}

		if ( 'edit' !== $screen->base ) {
			return;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $screen->post_type ) {
			return;
		}

		$dashboard_url = add_query_arg(
			[
				'post_type' => Story_Post_Type::POST_TYPE_SLUG,
				'page'      => 'stories-dashboard',
			],
			admin_url( 'edit.php' )
		)
		?>
		<div style="margin-top: 20px;">
			<a href="<?php echo esc_url( $dashboard_url ); ?>">
				<?php esc_html_e( '&larr; Return to Web Stories Dashboard', 'web-stories' ); ?>
			</a>
		</div>
		<?php
	}
}
