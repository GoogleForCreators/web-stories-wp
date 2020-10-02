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

use Google\Web_Stories\REST_API\Embed_Controller;
use Google\Web_Stories\REST_API\Fonts_Controller;
use Google\Web_Stories\REST_API\Stories_Media_Controller;
use Google\Web_Stories\REST_API\Link_Controller;
use Google\Web_Stories\REST_API\Stories_Autosaves_Controller;
use WP_Post;

/**
 * Plugin class.
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
	 * Experiments.
	 *
	 * @var Experiments
	 */
	public $experiments;

	/**
	 * Initialize plugin functionality.
	 *
	 * @since 1.0.0
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

		$this->tracking = new Tracking();
		add_action( 'init', [ $this->tracking, 'init' ] );

		$this->template = new Template_Post_Type();
		add_action( 'init', [ $this->template, 'init' ] );

		$this->dashboard = new Dashboard( $this->experiments );
		add_action( 'init', [ $this->dashboard, 'init' ] );

		$this->story = new Story_Post_Type( $this->experiments );
		add_action( 'init', [ $this->story, 'init' ] );

		// REST API endpoints.
		// High priority so it runs after create_initial_rest_routes().
		add_action( 'rest_api_init', [ $this, 'register_rest_routes' ], 100 );

		// Gutenberg Blocks.
		$this->embed_block = new Embed_Block();
		add_action( 'init', [ $this->embed_block, 'init' ] );

		// Frontend.
		$this->discovery = new Discovery();
		add_action( 'init', [ $this->discovery, 'init' ] );

		$this->analytics = new Analytics();
		add_action( 'init', [ $this->analytics, 'init' ] );

		// Register activation flag logic outside of 'init' since it hooks into
		// plugin activation.
		$activation_flag = new Activation_Flag();
		$activation_flag->init();

		$activation_notice = new Activation_Notice( $activation_flag );
		$activation_notice->init();
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
		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/plugin-compat/amp.php';
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

		$embed_controller = new Embed_Controller();
		$embed_controller->register_routes();

		$templates_autosaves = new Stories_Autosaves_Controller( Template_Post_Type::POST_TYPE_SLUG );
		$templates_autosaves->register_routes();

		$stories_autosaves = new Stories_Autosaves_Controller( Story_Post_Type::POST_TYPE_SLUG );
		$stories_autosaves->register_routes();

		$stories_media = new Stories_Media_Controller( 'attachment' );
		$stories_media->register_routes();
	}
}
