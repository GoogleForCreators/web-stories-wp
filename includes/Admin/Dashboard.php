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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Decoder;
use Google\Web_Stories\Experiments;
use Google\Web_Stories\Locale;
use Google\Web_Stories\Tracking;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Template_Post_Type;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Integrations\Site_Kit;
use Google\Web_Stories\Assets;
use Google\Web_Stories\Traits\Post_Type;
use Google\Web_Stories\Traits\Screen;
use Google\Web_Stories\Traits\Types;

/**
 * Dashboard class.
 */
class Dashboard extends Service_Base {
	use Types, Screen, Post_Type;

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'wp-dashboard';

	/**
	 * Admin page hook suffixes.
	 *
	 * @var array List of the admin pages' hook_suffix values.
	 */
	private $hook_suffix = [];

	/**
	 * Experiments instance.
	 *
	 * @var Experiments Experiments instance.
	 */
	private $experiments;

	/**
	 * Site_Kit instance.
	 *
	 * @var Site_Kit Site_Kit instance.
	 */
	private $site_kit;

	/**
	 * Decoder instance.
	 *
	 * @var Decoder Decoder instance.
	 */
	private $decoder;

	/**
	 * Locale instance.
	 *
	 * @var Locale Locale instance.
	 */
	private $locale;

	/**
	 * Google_Fonts instance.
	 *
	 * @var Google_Fonts Google_Fonts instance.
	 */
	private $google_fonts;

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private $assets;

	/**
	 * Dashboard constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Experiments  $experiments   Experiments instance.
	 * @param Site_Kit     $site_kit      Site_Kit instance.
	 * @param Decoder      $decoder       Decoder instance.
	 * @param Locale       $locale        Locale instance.
	 * @param Google_Fonts $google_fonts  Google_Fonts instance.
	 * @param Assets       $assets        Assets instance.
	 */
	public function __construct( Experiments $experiments, Site_Kit $site_kit, Decoder $decoder, Locale $locale, Google_Fonts $google_fonts, Assets $assets ) {
		$this->experiments  = $experiments;
		$this->decoder      = $decoder;
		$this->site_kit     = $site_kit;
		$this->locale       = $locale;
		$this->google_fonts = $google_fonts;
		$this->assets       = $assets;
	}

	/**
	 * Initializes the dashboard logic.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );
		add_action( 'admin_init', [ $this, 'redirect_menu_page' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_action( 'admin_notices', [ $this, 'display_link_to_dashboard' ] );
		add_action( 'load-web-story_page_stories-dashboard', [ $this, 'load_stories_dashboard' ] );
	}

	/**
	 * Returns the admin page's hook suffix.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key The current admin page key.
	 *
	 * @return string|false|null The dashboard page's hook_suffix, or false if the user does not have the capability required.
	 */
	public function get_hook_suffix( $key ) {
		return $this->hook_suffix[ $key ] ?? false;
	}

	/**
	 * Registers the dashboard admin menu page.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function add_menu_page() {
		$parent = 'edit.php?post_type=' . Story_Post_Type::POST_TYPE_SLUG;

		$this->hook_suffix['stories-dashboard'] = add_submenu_page(
			$parent,
			__( 'Dashboard', 'web-stories' ),
			__( 'Dashboard', 'web-stories' ),
			'edit_web-stories',
			'stories-dashboard',
			[ $this, 'render' ],
			0
		);

		$this->hook_suffix['stories-dashboard-explore'] = add_submenu_page(
			$parent,
			__( 'Explore Templates', 'web-stories' ),
			__( 'Explore Templates', 'web-stories' ),
			'edit_web-stories',
			'stories-dashboard#/templates-gallery',
			'__return_null',
			1
		);

		$this->hook_suffix['stories-dashboard-settings'] = add_submenu_page(
			$parent,
			__( 'Settings', 'web-stories' ),
			__( 'Settings', 'web-stories' ),
			'edit_web-stories',
			'stories-dashboard#/editor-settings',
			'__return_null',
			20
		);
	}

	/**
	 * Redirects to the correct Dashboard page when clicking on the top-level "Stories" menu item.
	 *
	 * @codeCoverageIgnore
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function redirect_menu_page() {
		global $pagenow;

		if ( ! isset( $_GET['page'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		$page = sanitize_text_field( (string) wp_unslash( $_GET['page'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( 'admin.php' === $pagenow && 'stories-dashboard' === $page ) {
			wp_safe_redirect(
				add_query_arg(
					[
						'post_type' => Story_Post_Type::POST_TYPE_SLUG,
						'page'      => 'stories-dashboard',
					],
					admin_url( 'edit.php' )
				)
			);
			exit;
		}
	}

	/**
	 * Preload API requests in the dashboard.
	 *
	 * Important: keep in sync with usage & definition in React app.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function load_stories_dashboard() {
		$rest_base = $this->get_post_type_rest_base( Story_Post_Type::POST_TYPE_SLUG );

		$preload_paths = [
			'/web-stories/v1/settings/',
			'/web-stories/v1/users/me/',
			"/web-stories/v1/$rest_base/?" . build_query(
				[
					'_embed'                => rawurlencode( 'wp:lock,wp:lockuser,author,wp:featuredmedia' ),
					'context'               => 'edit',
					'order'                 => 'desc',
					'orderby'               => 'modified',
					'page'                  => 1,
					'per_page'              => 24,
					'status'                => rawurlencode( 'publish,draft,future,private' ),
					'_web_stories_envelope' => 'true',
					'_fields'               => rawurlencode(
						implode(
							',',
							[
								'id',
								'title',
								'status',
								'date',
								'date_gmt',
								'modified',
								'modified_gmt',
								'link',
								'preview_link',
								'edit_link',
								// _web_stories_envelope will add these fields, we need them too.
								'body',
								'status',
								'headers',
							]
						)
					),
				]
			),
		];

		/**
		 * Preload common data by specifying an array of REST API paths that will be preloaded.
		 *
		 * Filters the array of paths that will be preloaded.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $preload_paths Array of paths to preload.
		 */
		$preload_paths = apply_filters( 'web_stories_dashboard_preload_paths', $preload_paths );

		$preload_data = array_reduce(
			$preload_paths,
			'\Google\Web_Stories\rest_preload_api_request',
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
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function render() {
		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/admin/dashboard.php';
	}

	/**
	 * Enqueues dashboard scripts and styles.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook_suffix The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_assets( $hook_suffix ) {
		if ( $this->get_hook_suffix( 'stories-dashboard' ) !== $hook_suffix ) {
			return;
		}

		$this->assets->enqueue_script_asset( self::SCRIPT_HANDLE, [ Tracking::SCRIPT_HANDLE ] );

		$this->assets->enqueue_style_asset( self::SCRIPT_HANDLE, [ $this->google_fonts::SCRIPT_HANDLE ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStoriesDashboardSettings',
			$this->get_dashboard_settings()
		);

		// Dequeue forms.css, see https://github.com/google/web-stories-wp/issues/349 .
		$this->assets->remove_admin_style( [ 'forms' ] );
	}

	/**
	 * Get dashboard settings as an array.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_dashboard_settings(): array {
		$rest_base     = $this->get_post_type_rest_base( Story_Post_Type::POST_TYPE_SLUG );
		$new_story_url = admin_url(
			add_query_arg(
				[
					'post_type' => Story_Post_Type::POST_TYPE_SLUG,
				],
				'post-new.php'
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

		// Media settings.
		$max_upload_size = wp_max_upload_size();
		if ( ! $max_upload_size ) {
			$max_upload_size = 0;
		}

		$templates_rest_base = $this->get_post_type_rest_base( Template_Post_Type::POST_TYPE_SLUG );

		$settings = [
			'id'         => 'web-stories-dashboard',
			'config'     => [
				'isRTL'                 => is_rtl(),
				'userId'                => get_current_user_id(),
				'locale'                => $this->locale->get_locale_settings(),
				'newStoryURL'           => $new_story_url,
				'wpListURL'             => $classic_wp_list_url,
				'cdnURL'                => trailingslashit( WEBSTORIES_CDN_URL ),
				'allowedImageMimeTypes' => $this->get_allowed_image_mime_types(),
				'version'               => WEBSTORIES_VERSION,
				'encodeMarkup'          => $this->decoder->supports_decoding(),
				'api'                   => [
					'stories'     => sprintf( '/web-stories/v1/%s/', $rest_base ),
					'media'       => '/web-stories/v1/media/',
					'currentUser' => '/web-stories/v1/users/me/',
					'users'       => '/web-stories/v1/users/',
					'templates'   => sprintf( '/web-stories/v1/%s/', $templates_rest_base ),
					'settings'    => '/web-stories/v1/settings/',
				],
				'maxUpload'             => $max_upload_size,
				'maxUploadFormatted'    => size_format( $max_upload_size ),
				'capabilities'          => [
					'canManageSettings' => current_user_can( 'manage_options' ),
					'canUploadFiles'    => current_user_can( 'upload_files' ),
				],
				'siteKitStatus'         => $this->site_kit->get_plugin_status(),
			],
			'flags'      => array_merge(
				$this->experiments->get_experiment_statuses( 'general' ),
				$this->experiments->get_experiment_statuses( 'dashboard' )
			),
			'publicPath' => $this->assets->get_base_url( 'assets/js/' ),
		];

		/**
		 * Filters settings passed to the web stories dashboard.
		 *
		 * @since 1.0.0
		 *
		 * @param array $settings Array of settings passed to web stories dashboard.
		 */
		return apply_filters( 'web_stories_dashboard_settings', $settings );
	}

	/**
	 * Displays a link to the Web Stories dashboard on the WordPress list table view.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function display_link_to_dashboard() {
		$screen = $this->get_current_screen();
		if ( ! $screen ) {
			return;
		}

		if ( ! $this->is_edit_screen( $screen ) ) {
			return;
		}

		if ( 'edit' !== $screen->base ) {
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
