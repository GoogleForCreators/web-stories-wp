<?php
/**
 * Main Plugin class.
 *
 * Responsible for initializing the plugin.
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

use Google\Web_Stories\Integrations\AMP;
use Google\Web_Stories\Integrations\Jetpack;
use Google\Web_Stories\Integrations\NextGen_Gallery;
use Google\Web_Stories\Integrations\Site_Kit;
use Google\Web_Stories\REST_API\Embed_Controller;
use Google\Web_Stories\REST_API\Status_Check_Controller;
use Google\Web_Stories\REST_API\Stories_Media_Controller;
use Google\Web_Stories\REST_API\Link_Controller;
use Google\Web_Stories\REST_API\Stories_Autosaves_Controller;
use Google\Web_Stories\Block\Embed_Block;
use Google\Web_Stories\REST_API\Stories_Settings_Controller;
use Google\Web_Stories\REST_API\Stories_Users_Controller;
use Google\Web_Stories\Shortcode\Embed_Shortcode;
use Google\Web_Stories\Shortcode\Stories_Shortcode;

/**
 * Plugin class.
 *
 * @SuppressWarnings(PHPMD.TooManyFields)
 */
class Plugin {
	/**
	 * Media object.
	 *
	 * @var Media
	 */
	public $media;

	/**
	 * Story Post Type object.
	 *
	 * @var  Story_Post_Type
	 */
	public $story;

	/**
	 * Template object.
	 *
	 * @var Template_Post_Type
	 */
	public $template;

	/**
	 * Dashboard.
	 *
	 * @var Dashboard
	 */
	public $dashboard;

	/**
	 * Settings.
	 *
	 * @var Settings
	 */
	public $settings;

	/**
	 * Admin-related functionality.
	 *
	 * @var Admin
	 */
	public $admin;

	/**
	 * Gutenberg Blocks.
	 *
	 * @var Embed_Block
	 */
	public $embed_block;

	/**
	 * Embed shortcode
	 *
	 * @var Embed_Shortcode
	 */
	public $embed_shortcode;

	/**
	 * Embed base
	 *
	 * @var Embed_Base
	 */
	public $embed_base;

	/**
	 * Frontend.
	 *
	 * @var Discovery
	 */
	public $discovery;

	/**
	 * Tracking.
	 *
	 * @var Tracking
	 */
	public $tracking;

	/**
	 * Database Upgrader.
	 *
	 * @var Database_Upgrader
	 */
	public $database_upgrader;

	/**
	 * Analytics.
	 *
	 * @var Analytics
	 */
	public $analytics;

	/**
	 * AdSense.
	 *
	 * @var AdSense
	 */
	public $adsense;

	/**
	 * Ad Manager.
	 *
	 * @var Ad_Manager
	 */
	public $ad_manager;

	/**
	 * Experiments.
	 *
	 * @var Experiments
	 */
	public $experiments;

	/**
	 * 3P integrations.
	 *
	 * @var array
	 */
	public $integrations = [];

	/**
	 * Meta boxes.
	 *
	 * @var Meta_Boxes
	 */
	public $meta_boxes;

	/**
	 * SVG.
	 *
	 * @var SVG
	 */
	public $svg;

	/**
	 * User_Preferences.
	 *
	 * @var User_Preferences
	 */
	public $user_preferences;

	/**
	 * KSES.
	 *
	 * @var KSES
	 */
	public $kses;

	/**
	 * Initialize plugin functionality.
	 *
	 * @since 1.0.0
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @return void
	 */
	public function register() {
		// Plugin compatibility / polyfills.
		add_action( 'wp', [ $this, 'load_amp_plugin_compat' ] );

		// Settings.
		$this->settings = new Settings();
		add_action( 'init', [ $this->settings, 'init' ], 5 );

		$this->experiments = new Experiments();
		add_action( 'init', [ $this->experiments, 'init' ], 7 );

		// Admin-related functionality.

		// Migrations.
		$this->database_upgrader = new Database_Upgrader();
		add_action( 'admin_init', [ $this->database_upgrader, 'init' ], 5 );

		$this->admin = new Admin();
		add_action( 'admin_init', [ $this->admin, 'init' ] );

		$this->media = new Media();
		add_action( 'init', [ $this->media, 'init' ] );

		// KSES
		// High priority to load after Story_Post_Type.
		$this->kses = new KSES();
		add_action( 'init', [ $this->kses, 'init' ], 11 );

		$this->template = new Template_Post_Type();
		add_action( 'init', [ $this->template, 'init' ] );

		$this->meta_boxes = new Meta_Boxes();
		add_action( 'admin_init', [ $this->meta_boxes, 'init' ] );

		$this->story = new Story_Post_Type( $this->experiments, $this->meta_boxes );
		add_action( 'init', [ $this->story, 'init' ] );

		// REST API endpoints.
		// High priority so it runs after create_initial_rest_routes().
		add_action( 'rest_api_init', [ $this, 'register_rest_routes' ], 100 );

		// Embed base.
		$this->embed_base = new Embed_Base();
		add_action( 'init', [ $this->embed_base, 'init' ], 9 );

		// Gutenberg Blocks.
		$this->embed_block = new Embed_Block();
		add_action( 'init', [ $this->embed_block, 'init' ] );

		// Embed shortcode.
		$this->embed_shortcode = new Embed_Shortcode();
		add_action( 'init', [ $this->embed_shortcode, 'init' ] );

		$story_shortcode = new Stories_Shortcode();
		add_action( 'init', [ $story_shortcode, 'init' ] );

		$customizer = new Customizer();
		add_action( 'init', [ $customizer, 'init' ] );

		// Frontend.
		$this->discovery = new Discovery();
		add_action( 'init', [ $this->discovery, 'init' ] );

		$this->analytics = new Analytics();
		add_action( 'init', [ $this->analytics, 'init' ] );

		$this->adsense = new AdSense();
		add_action( 'init', [ $this->adsense, 'init' ] );

		$this->ad_manager = new Ad_Manager();
		add_action( 'init', [ $this->ad_manager, 'init' ] );

		$this->user_preferences = new User_Preferences();
		add_action( 'init', [ $this->user_preferences, 'init' ] );

		$this->svg = new SVG( $this->experiments );
		add_action( 'init', [ $this->svg, 'init' ] );

		// Register activation flag logic outside of 'init' since it hooks into
		// plugin activation.
		$activation_flag = new Activation_Flag();
		$activation_flag->init();

		$activation_notice = new Activation_Notice( $activation_flag );
		$activation_notice->init();

		$amp = new AMP();
		add_action( 'init', [ $amp, 'init' ] );
		$this->integrations['amp'] = $amp;

		$jetpack = new Jetpack();
		add_action( 'init', [ $jetpack, 'init' ] );
		$this->integrations['jetpack'] = $jetpack;

		// This runs at init priority -2 because NextGEN inits at -1.
		$nextgen_gallery = new NextGen_Gallery();
		add_action( 'init', [ $nextgen_gallery, 'init' ], -2 );
		$this->integrations['nextgen_gallery'] = $nextgen_gallery;

		$site_kit = new Site_Kit( $this->analytics );
		add_action( 'init', [ $site_kit, 'init' ] );
		$this->integrations['site-kit'] = $site_kit;

		$this->dashboard = new Dashboard( $this->experiments, $this->integrations['site-kit'] );
		add_action( 'init', [ $this->dashboard, 'init' ] );

		$this->tracking = new Tracking( $this->experiments, $site_kit );
		add_action( 'admin_init', [ $this->tracking, 'init' ] );
	}

	/**
	 * Initializes functionality to improve compatibility with the AMP plugin.
	 *
	 * Loads a separate PHP file that allows defining functions in the global namespace.
	 *
	 * Runs on the 'wp' hook to ensure the WP environment has been fully set up,
	 *
	 * @return void
	 */
	public function load_amp_plugin_compat() {
		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/compat/amp.php';
	}

	/**
	 * Registers REST API routes.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_rest_routes() {

		$link_controller = new Link_Controller();
		$link_controller->register_routes();

		$status_check = new Status_Check_Controller();
		$status_check->register_routes();

		$embed_controller = new Embed_Controller();
		$embed_controller->register_routes();

		$templates_autosaves = new Stories_Autosaves_Controller( Template_Post_Type::POST_TYPE_SLUG );
		$templates_autosaves->register_routes();

		$stories_autosaves = new Stories_Autosaves_Controller( Story_Post_Type::POST_TYPE_SLUG );
		$stories_autosaves->register_routes();

		$stories_media = new Stories_Media_Controller( 'attachment' );
		$stories_media->register_routes();

		$stories_users = new Stories_Users_Controller();
		$stories_users->register_routes();

		$stories_settings = new Stories_Settings_Controller();
		$stories_settings->register_routes();
	}
}
