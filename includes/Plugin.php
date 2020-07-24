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
	 * Beta version updater.
	 *
	 * @var Updater
	 */
	public $updater;

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
	 * Initialize plugin functionality.
	 *
	 * @return void
	 */
	public function register() {
		$this->media = new Media();
		add_action( 'init', [ $this->media, 'init' ], 9 );

		$this->story = new Story_Post_Type();
		add_action( 'init', [ $this->story, 'init' ] );

		$this->template = new Template_Post_Type();
		add_action( 'init', [ $this->template, 'init' ] );

		// Beta version updater.
		$this->updater = new Updater();
		add_action( 'init', [ $this->updater, 'init' ], 9 );

		$this->tracking = new Tracking();
		add_action( 'init', [ $this->tracking, 'init' ] );

		// REST API endpoints.
		// High priority so it runs after create_initial_rest_routes().
		add_action( 'rest_api_init', [ $this, 'register_rest_routes' ], 100 );

		// Settings.
		$this->settings = new Settings();
		add_action( 'init', [ $this->settings, 'init' ] );

		// Dashboard.
		$this->dashboard = new Dashboard();
		add_action( 'init', [ $this->dashboard, 'init' ] );

		// Migrations.
		$this->database_upgrader = new Database_Upgrader();
		add_action( 'admin_init', [ $this->database_upgrader, 'init' ] );

		// Admin-related functionality.
		$this->admin = new Admin();
		add_action( 'admin_init', [ $this->admin, 'init' ] );

		// Gutenberg Blocks.
		$this->embed_block = new Embed_Block();
		add_action( 'init', [ $this->embed_block, 'init' ] );

		// Frontend.
		$this->discovery = new Discovery();
		add_action( 'init', [ $this->discovery, 'init' ] );

		// Register activation flag logic outside of 'init' since it hooks into
		// plugin activation.
		$activation_flag = new Activation_Flag();
		$activation_flag->init();

		$activation_notice = new Activation_Notice( $activation_flag );
		$activation_notice->init();
	}

	/**
	 * Registers REST API routes.
	 *
	 * @return void
	 */
	public function register_rest_routes() {
		$fonts_controller = new Fonts_Controller();
		$fonts_controller->register_routes();

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
