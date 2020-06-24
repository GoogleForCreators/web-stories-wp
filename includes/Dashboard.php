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

use Google\Web_Stories\Traits\Assets;
use WP_Screen;

/**
 * Dashboard class.
 */
class Dashboard {

	use Assets;
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
		add_action( 'load-web-story_page_stories-dashboard', [ $this, 'load_stories_dashboard' ] );
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
	 * Preload api requests in the dashboard.
	 *
	 * @return void
	 */
	public function load_stories_dashboard() {
		// Preload common data.
		// TODO Preload templates.
		$preload_paths = [
			'/web-stories/v1/fonts',
		];

		/**
		 * Preload common data by specifying an array of REST API paths that will be preloaded.
		 *
		 * Filters the array of paths that will be preloaded.
		 *
		 * @param string[] $preload_paths Array of paths to preload.
		 */
		$preload_paths = apply_filters( 'web_stories_dashboard_preload_paths', $preload_paths );

		$preload_data = array_reduce(
			$preload_paths,
			'rest_preload_api_request',
			[]
		);

		wp_add_inline_script(
			'wp-api-fetch',
			sprintf( 'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );', wp_json_encode( $preload_data ) ),
			'after'
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

		wp_register_style(
			'google-fonts',
			'https://fonts.googleapis.com/css?family=Google+Sans|Google+Sans:b|Google+Sans:500|Roboto:400',
			[],
			WEBSTORIES_VERSION
		);

		$this->enqueue_script( self::SCRIPT_HANDLE );
		$this->enqueue_style( self::SCRIPT_HANDLE, [ 'google-fonts' ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesDashboardSettings',
			$this->get_dashboard_settings()
		);

		// Dequeue forms.css, see https://github.com/google/web-stories-wp/issues/349 .
		$this->remove_admin_style( [ 'forms' ] );
	}

	/**
	 * Get dashboard settings as an array.
	 *
	 * @return array
	 */
	public function get_dashboard_settings() {
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

		$settings = [
			'id'     => 'web-stories-dashboard',
			'config' => [
				'isRTL'        => is_rtl(),
				'newStoryURL'  => $new_story_url,
				'editStoryURL' => $edit_story_url,
				'wpListURL'    => $classic_wp_list_url,
				'assetsURL'    => trailingslashit( WEBSTORIES_ASSETS_URL ),
				'version'      => WEBSTORIES_VERSION,
				'api'          => [
					'stories'   => sprintf( '/wp/v2/%s', $rest_base ),
					'users'     => '/wp/v2/users',
					'fonts'     => '/web-stories/v1/fonts',
					'templates' => '/wp/v2/web-story-template',
				],
			],
			'flags'  => [
				/**
				 * Description: Enables user facing animations.
				 * Author: @littlemilkstudio
				 * Issue: 1897
				 * Creation date: 2020-05-21
				 */
				'enableAnimation'                 => false,
				/**
				 * Description: Enables in-progress views to be accessed.
				 * Author: @carlos-kelly
				 * Issue: 2081
				 * Creation date: 2020-05-28
				 */
				'enableInProgressViews'           => false,
				/**
				 * Description: Enables in-progress story actions.
				 * Author: @brittanyirl
				 * Issue: 2344
				 * Creation date: 2020-06-10
				 */
				'enableInProgressStoryActions'    => false,
				/**
				 * Description: Enables in-progress template actions.
				 * Author: @brittanyirl
				 * Issue: 2381
				 * Creation date: 2020-06-11
				 */
				'enableInProgressTemplateActions' => false,
				/**
				 * Description: Enables bookmark actions.
				 * Author: @brittanyirl
				 * Issue: 2292
				 * Creation date: 2020-06-11
				 */
				'enableBookmarkActions'           => false,
			],
		];

		return $settings;
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
