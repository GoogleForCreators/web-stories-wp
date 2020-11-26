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

/**
 * Plugin class.
 */
class Plugin {

	/**
	 * Array of objects.
	 *
	 * @var array
	 */
	public $objects = [];

	/**
	 * Array of defined services.
	 *
	 * @var array
	 */
	const SERVICES = [
		'settings'          => [
			'class'    => Settings::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 5,
		],
		'experiments'       => [
			'class'    => Experiments::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 7,
		],
		'database_upgrader' => [
			'class'    => Database_Upgrader::class,
			'action'   => 'admin_init',
			'method'   => 'init',
			'priority' => 5,
		],
		'admin'             => [
			'class'    => Admin::class,
			'action'   => 'admin_init',
			'method'   => 'init',
			'priority' => 10,
		],
		'media'             => [
			'class'    => Media::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 10,
		],
		'tracking'          => [
			'class'    => Tracking::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 10,
		],
		'template'          => [
			'class'    => Template_Post_Type::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 10,
		],
		'story'             => [
			'class'        => Story_Post_Type::class,
			'action'       => 'init',
			'method'       => 'init',
			'priority'     => 10,
			'dependencies' => [
				'experiments',
			],
		],
		'embed_base'        => [
			'class'    => Embed_Base::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 9,
		],
		'embed_block'       => [
			'class'    => Embed_Block::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 10,
		],
		'embed_shortcode'   => [
			'class'    => Embed_Shortcode::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 10,
		],
		'discovery'         => [
			'class'    => Discovery::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 10,
		],
		'analytics'         => [
			'class'    => Analytics::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 10,
		],
		'activation_flag'   => [
			'class'  => Activation_Flag::class,
			'method' => 'init',
		],
		'activation_notice' => [
			'class'        => Activation_Notice::class,
			'method'       => 'init',
			'dependencies' => [
				'activation_flag',
			],
		],
		'amp'               => [
			'class'    => AMP::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 10,
		],
		'jetpack'           => [
			'class'    => Jetpack::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => 10,
		],
		'nextgen_gallery'   => [
			'class'    => NextGen_Gallery::class,
			'action'   => 'init',
			'method'   => 'init',
			'priority' => - 2,
		],
		'site_kit'          => [
			'class'        => Site_Kit::class,
			'action'       => 'init',
			'method'       => 'init',
			'priority'     => 10,
			'dependencies' => [
				'analytics',
			],
		],
		'dashboard'         => [
			'class'        => Dashboard::class,
			'action'       => 'init',
			'method'       => 'init',
			'priority'     => 10,
			'dependencies' => [
				'experiments',
				'site_kit',
			],
		],
	];

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


		$this->register_services();

		// REST API endpoints.
		// High priority so it runs after create_initial_rest_routes().
		add_action( 'rest_api_init', [ $this, 'register_rest_routes' ], 100 );
	}

	/**
	 * Register services
	 *
	 * @return void
	 */
	protected function register_services() {
		foreach ( $this::SERVICES as $name => $props ) {
			$this->register_service( $name, $props );
		}
	}


	/**
	 * Return a registered service.
	 *
	 * @param string $name Name of service as key.
	 * @param array  $props Array of props.
	 *
	 * @return false|Object
	 */
	protected function register_service( $name, array $props = [] ) {
		if ( isset( $this->objects[ $name ] ) ) {
			return $this->objects[ $name ];
		}
		if ( ! isset( $this::SERVICES[ $name ] ) ) {
			return false;
		}

		if ( ! $props ) {
			$props = $this::SERVICES[ $name ];
		}
		if ( isset( $props['dependencies'] ) ) {
			$args   = array_map( [ $this, 'register_service' ], $props['dependencies'] );
			$object = new $props['class']( ...$args );
		} else {
			$object = new $props['class']();
		}

		if ( isset( $props['action'] ) && $props['action'] ) {
			add_action( $props['action'], [ $object, $props['method'] ], $props['priority'] );
		} elseif ( isset( $props['method'] ) && $props['method'] ) {
			$object->{$props['method']}();
		}

		$this->objects[ $name ] = $object;

		return $this->objects[ $name ];
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

		$experiments  = new Experiments();
		$status_check = new Status_Check_Controller( $experiments );
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
