<?php
/**
 * Dashboard class.
 *
 * Responsible for adding the stories dashboard to WordPress admin.
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

namespace Google\Web_Stories\Admin;

use Google\Web_Stories\Assets;
use Google\Web_Stories\Context;
use Google\Web_Stories\Decoder;
use Google\Web_Stories\Experiments;
use Google\Web_Stories\Font_Post_Type;
use Google\Web_Stories\Integrations\Site_Kit;
use Google\Web_Stories\Integrations\WooCommerce;
use Google\Web_Stories\Locale;
use Google\Web_Stories\Media\Types;
use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Settings;
use Google\Web_Stories\Shopping\Shopping_Vendors;
use Google\Web_Stories\Story_Post_Type;
use Google\Web_Stories\Tracking;

/**
 * Dashboard class.
 */
class Dashboard extends Service_Base {

	/**
	 * Script handle.
	 */
	public const SCRIPT_HANDLE = 'web-stories-dashboard';

	/**
	 * Admin page hook suffixes.
	 *
	 * @var array<string,string|bool> List of the admin pages' hook_suffix values.
	 */
	private array $hook_suffix = [];

	/**
	 * Experiments instance.
	 *
	 * @var Experiments Experiments instance.
	 */
	private Experiments $experiments;

	/**
	 * Site_Kit instance.
	 *
	 * @var Site_Kit Site_Kit instance.
	 */
	private Site_Kit $site_kit;

	/**
	 * Decoder instance.
	 *
	 * @var Decoder Decoder instance.
	 */
	private Decoder $decoder;

	/**
	 * Locale instance.
	 *
	 * @var Locale Locale instance.
	 */
	private Locale $locale;

	/**
	 * Google_Fonts instance.
	 *
	 * @var Google_Fonts Google_Fonts instance.
	 */
	private Google_Fonts $google_fonts;

	/**
	 * Assets instance.
	 *
	 * @var Assets Assets instance.
	 */
	private Assets $assets;

	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private Story_Post_Type $story_post_type;

	/**
	 * Font_Post_Type instance.
	 *
	 * @var Font_Post_Type Font_Post_Type instance.
	 */
	private Font_Post_Type $font_post_type;

	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private Context $context;

	/**
	 * Types instance.
	 *
	 * @var Types Types instance.
	 */
	private Types $types;

	/**
	 * Shopping_Vendors instance.
	 *
	 * @var Shopping_Vendors Shopping_Vendors instance.
	 */
	private Shopping_Vendors $shopping_vendors;

	/**
	 * WooCommerce instance.
	 *
	 * @var WooCommerce WooCommerce instance.
	 */
	private WooCommerce $woocommerce;

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private Settings $settings;

	/**
	 * Dashboard constructor.
	 *
	 * @SuppressWarnings("PHPMD.ExcessiveParameterList")
	 *
	 * @since 1.0.0
	 *
	 * @param Experiments      $experiments      Experiments instance.
	 * @param Site_Kit         $site_kit         Site_Kit instance.
	 * @param Decoder          $decoder          Decoder instance.
	 * @param Locale           $locale           Locale instance.
	 * @param Google_Fonts     $google_fonts     Google_Fonts instance.
	 * @param Assets           $assets           Assets instance.
	 * @param Font_Post_Type   $font_post_type   Font_Post_Type instance.
	 * @param Story_Post_Type  $story_post_type  Story_Post_Type instance.
	 * @param Context          $context          Context instance.
	 * @param Types            $types            Types instance.
	 * @param Shopping_Vendors $shopping_vendors Shopping_Vendors instance.
	 * @param WooCommerce      $woocommerce      WooCommerce instance.
	 * @param Settings         $settings         Settings instance.
	 */
	public function __construct(
		Experiments $experiments,
		Site_Kit $site_kit,
		Decoder $decoder,
		Locale $locale,
		Google_Fonts $google_fonts,
		Assets $assets,
		Font_Post_Type $font_post_type,
		Story_Post_Type $story_post_type,
		Context $context,
		Types $types,
		Shopping_Vendors $shopping_vendors,
		WooCommerce $woocommerce,
		Settings $settings
	) {
		$this->experiments      = $experiments;
		$this->decoder          = $decoder;
		$this->site_kit         = $site_kit;
		$this->locale           = $locale;
		$this->google_fonts     = $google_fonts;
		$this->assets           = $assets;
		$this->font_post_type   = $font_post_type;
		$this->story_post_type  = $story_post_type;
		$this->context          = $context;
		$this->types            = $types;
		$this->shopping_vendors = $shopping_vendors;
		$this->woocommerce      = $woocommerce;
		$this->settings         = $settings;
	}

	/**
	 * Initializes the dashboard logic.
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
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
	 * @return bool|string The dashboard page's hook_suffix, or false if the user does not have the capability required.
	 */
	public function get_hook_suffix( string $key ) {
		return $this->hook_suffix[ $key ] ?? false;
	}

	/**
	 * Registers the dashboard admin menu page.
	 *
	 * @since 1.0.0
	 */
	public function add_menu_page(): void {
		$parent = 'edit.php?post_type=' . $this->story_post_type->get_slug();

		// Not using get_dashboard_settings() to avoid an extra database query.

		$settings = [
			'canViewDefaultTemplates' => true,
		];

		/** This filter is documented in includes/Admin/Dashboard.php */
		$settings = apply_filters( 'web_stories_dashboard_settings', $settings );

		/**
		 * The edit_posts capability.
		 *
		 * @var string $edit_posts
		 */
		$edit_posts = $this->story_post_type->get_cap_name( 'edit_posts' );

		$this->hook_suffix['stories-dashboard'] = add_submenu_page(
			$parent,
			__( 'Dashboard', 'web-stories' ),
			__( 'Dashboard', 'web-stories' ),
			$edit_posts, // phpcs:ignore WordPress.WP.Capabilities.Undetermined
			'stories-dashboard',
			[ $this, 'render' ],
			0
		);

		if ( isset( $settings['canViewDefaultTemplates'] ) && $settings['canViewDefaultTemplates'] ) {
			$this->hook_suffix['stories-dashboard-explore'] = add_submenu_page(
				$parent,
				__( 'Explore Templates', 'web-stories' ),
				__( 'Explore Templates', 'web-stories' ),
				$edit_posts, // phpcs:ignore WordPress.WP.Capabilities.Undetermined
				'stories-dashboard#/templates-gallery',
				'__return_null',
				1
			);
		}

		$this->hook_suffix['stories-dashboard-settings'] = add_submenu_page(
			$parent,
			__( 'Settings', 'web-stories' ),
			__( 'Settings', 'web-stories' ),
			$edit_posts, // phpcs:ignore WordPress.WP.Capabilities.Undetermined
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
	 */
	public function redirect_menu_page(): void {
		global $pagenow;

		if ( ! isset( $_GET['page'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		/**
		 * Page slug.
		 *
		 * @var string $page
		 */
		$page = $_GET['page']; // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$page = sanitize_text_field( (string) wp_unslash( $page ) );

		if ( 'admin.php' === $pagenow && 'stories-dashboard' === $page ) {
			wp_safe_redirect(
				add_query_arg(
					[
						'post_type' => $this->story_post_type->get_slug(),
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
	 */
	public function load_stories_dashboard(): void {
		$rest_url = trailingslashit( $this->story_post_type->get_rest_url() );

		$preload_paths = [
			'/web-stories/v1/settings/',
			'/web-stories/v1/publisher-logos/',
			'/web-stories/v1/users/me/',
			'/web-stories/v1/taxonomies/?' . build_query(
				[
					'type'         => $this->story_post_type->get_slug(),
					'context'      => 'edit',
					'hierarchical' => 'true',
					'show_ui'      => 'true',
				]
			),
			$rest_url . '?' . build_query(
				[
					'_embed'                => rawurlencode(
						implode(
							',',
							[ 'wp:lock', 'author' ]
						)
					),
					'context'               => 'edit',
					'order'                 => 'desc',
					'orderby'               => 'modified',
					'page'                  => 1,
					'per_page'              => 24,
					'status'                => rawurlencode(
						implode(
							',',
							[ 'draft', 'future', 'pending', 'publish', 'private' ]
						)
					),
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
								'story_poster',
								'link',
								'preview_link',
								'edit_link',
								'_links', // Needed for WP 6.1+.
								'_embedded',
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
			\sprintf( 'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );', wp_json_encode( $preload_data ) ),
			'after'
		);
	}

	/**
	 * Renders the dashboard page.
	 *
	 * @since 1.0.0
	 */
	public function render(): void {
		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/admin/dashboard.php';
	}

	/**
	 * Enqueues dashboard scripts and styles.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_assets( string $hook_suffix ): void {
		if ( $this->get_hook_suffix( 'stories-dashboard' ) !== $hook_suffix ) {
			return;
		}

		$this->assets->enqueue_script_asset( self::SCRIPT_HANDLE, [ Tracking::SCRIPT_HANDLE ], false );

		$this->assets->enqueue_style_asset( self::SCRIPT_HANDLE, [ $this->google_fonts::SCRIPT_HANDLE ] );

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'webStories',
			[
				'publicPath' => $this->assets->get_base_url( 'assets/js/' ), // Required before the editor script is enqueued.
				'localeData' => $this->assets->get_translations( self::SCRIPT_HANDLE ), // Required for i18n setLocaleData.
			]
		);

		// Dequeue forms.css, see https://github.com/googleforcreators/web-stories-wp/issues/349 .
		$this->assets->remove_admin_style( [ 'forms' ] );
	}

	/**
	 * Get dashboard settings as an array.
	 *
	 * @since 1.0.0
	 *
	 * @return array<string,bool|string|int|array<string,mixed>>
	 */
	public function get_dashboard_settings(): array {
		$new_story_url = admin_url(
			add_query_arg(
				[
					'post_type' => $this->story_post_type->get_slug(),
				],
				'post-new.php'
			)
		);

		// Media settings.
		$max_upload_size = wp_max_upload_size();
		if ( ! $max_upload_size ) {
			$max_upload_size = 0;
		}
		$mime_types               = $this->types->get_allowed_mime_types();
		$allowed_image_mime_types = $mime_types['image'];
		$vendors                  = wp_list_pluck( $this->shopping_vendors->get_vendors(), 'label' );

		$auto_advance  = $this->settings->get_setting( $this->settings::SETTING_NAME_AUTO_ADVANCE );
		$page_duration = $this->settings->get_setting( $this->settings::SETTING_NAME_DEFAULT_PAGE_DURATION );

		$plugin_file          = plugin_basename( WEBSTORIES_PLUGIN_FILE );
		$auto_updates         = (array) get_site_option( 'auto_update_plugins', [] );
		$auto_updates_enabled = \in_array( $plugin_file, $auto_updates, true );
		$plugin_updates       = get_site_transient( 'update_plugins' );
		$needs_update         = \is_object( $plugin_updates ) &&
								property_exists( $plugin_updates, 'response' ) &&
								\is_array( $plugin_updates->response ) &&
								! empty( $plugin_updates->response[ $plugin_file ] );
		$can_update           = current_user_can( 'update_plugins' );

		$settings = [
			'isRTL'                   => is_rtl(),
			'userId'                  => get_current_user_id(),
			'locale'                  => $this->locale->get_locale_settings(),
			'newStoryURL'             => $new_story_url,
			'archiveURL'              => $this->story_post_type->get_archive_link(),
			'defaultArchiveURL'       => $this->story_post_type->get_archive_link( true ),
			'cdnURL'                  => trailingslashit( WEBSTORIES_CDN_URL ),
			'allowedImageMimeTypes'   => $allowed_image_mime_types,
			'version'                 => WEBSTORIES_VERSION,
			'encodeMarkup'            => $this->decoder->supports_decoding(),
			'api'                     => [
				'stories'        => trailingslashit( $this->story_post_type->get_rest_url() ),
				'media'          => '/web-stories/v1/media/',
				'currentUser'    => '/web-stories/v1/users/me/',
				'fonts'          => trailingslashit( $this->font_post_type->get_rest_url() ),
				'users'          => '/web-stories/v1/users/',
				'settings'       => '/web-stories/v1/settings/',
				'pages'          => '/wp/v2/pages/',
				'publisherLogos' => '/web-stories/v1/publisher-logos/',
				'taxonomies'     => '/web-stories/v1/taxonomies/',
				'products'       => '/web-stories/v1/products/',
			],
			'vendors'                 => $vendors,
			'maxUpload'               => $max_upload_size,
			'maxUploadFormatted'      => size_format( $max_upload_size ),
			'editPostsCapabilityName' => $this->story_post_type->get_cap_name( 'edit_posts' ),
			'capabilities'            => [
				'canManageSettings' => current_user_can( 'manage_options' ),
				'canUploadFiles'    => current_user_can( 'upload_files' ),
			],
			'canViewDefaultTemplates' => true,
			'plugins'                 => [
				'siteKit'     => $this->site_kit->get_plugin_status(),
				'woocommerce' => $this->woocommerce->get_plugin_status(),
				'web-stories' => [
					'needsUpdate' => $needs_update && ! $auto_updates_enabled,
					'updateLink'  => $can_update ? admin_url( 'plugins.php' ) : null,
				],
			],
			'flags'                   => array_merge(
				$this->experiments->get_experiment_statuses( 'general' ),
				$this->experiments->get_experiment_statuses( 'dashboard' ),
			),
			'globalAutoAdvance'       => (bool) $auto_advance,
			'globalPageDuration'      => (float) $page_duration,
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
	 */
	public function display_link_to_dashboard(): void {
		if ( ! $this->context->is_story_editor() ) {
			return;
		}

		if ( 'edit' !== $this->context->get_screen_base() ) {
			return;
		}

		$dashboard_url = add_query_arg(
			[
				'post_type' => $this->story_post_type->get_slug(),
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
