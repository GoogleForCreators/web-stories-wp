<?php
/**
 * Class Database_Upgrader
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

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Infrastructure\PluginActivationAware;
use Google\Web_Stories\Infrastructure\PluginUninstallAware;
use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Infrastructure\SiteInitializationAware;
use Google\Web_Stories\Interfaces\Migration;
use WP_Site;

/**
 * Class Database_Upgrader
 */
class Database_Upgrader implements Service, Registerable, PluginActivationAware, SiteInitializationAware, PluginUninstallAware {

	/**
	 * The slug of database option.
	 */
	public const OPTION = 'web_stories_db_version';

	/**
	 * The slug of database option.
	 */
	public const PREVIOUS_OPTION = 'web_stories_previous_db_version';

	/**
	 * Array of classes to run migration routines.
	 */
	public const ROUTINES = [
		'1.0.0'  => Migrations\Update_1::class,
		'2.0.0'  => Migrations\Replace_Conic_Style_Presets::class,
		'2.0.1'  => Migrations\Add_Media_Source_Editor::class,
		'2.0.2'  => Migrations\Remove_Broken_Text_Styles::class,
		'2.0.3'  => Migrations\Unify_Color_Presets::class,
		'2.0.4'  => Migrations\Update_Publisher_Logos::class,
		'3.0.0'  => Migrations\Add_Stories_Caps::class,
		'3.0.1'  => Migrations\Rewrite_Flush::class,
		'3.0.2'  => Migrations\Rewrite_Flush::class,
		'3.0.4'  => Migrations\Add_Poster_Generation_Media_Source::class,
		'3.0.5'  => Migrations\Remove_Unneeded_Attachment_Meta::class,
		'3.0.6'  => Migrations\Add_Media_Source_Video_Optimization::class,
		'3.0.7'  => Migrations\Add_Media_Source_Source_Video::class,
		'3.0.8'  => Migrations\Rewrite_Flush::class,
		'3.0.9'  => Migrations\Add_VideoPress_Poster_Generation_Media_Source::class,
		'3.0.10' => Migrations\Add_Media_Source_Gif_Conversion::class,
		'3.0.11' => Migrations\Add_Media_Source_Source_Image::class,
		'3.0.12' => Migrations\Set_Legacy_Analytics_Usage_Flag::class,
		'3.0.13' => Migrations\Add_Stories_Caps::class,
		'3.0.14' => Migrations\Add_Media_Source_Page_Template::class,
		'3.0.15' => Migrations\Add_Media_Source_Recording::class,
		'3.0.16' => Migrations\Remove_Incorrect_Tracking_Id::class,
	];

	/**
	 * Injector instance.
	 *
	 * @var Injector Injector instance.
	 */
	private Injector $injector;

	/**
	 * Database_Upgrader constructor.
	 *
	 * @param Injector $injector Injector instance.
	 */
	public function __construct( Injector $injector ) {
		$this->injector = $injector;
	}

	/**
	 * Hooked into admin_init and walks through an array of upgrade methods.
	 *
	 * @since 1.0.0
	 */
	public function register(): void {
		add_action( 'admin_init', [ $this, 'run_upgrades' ], 5 );
	}

	/**
	 * Act on plugin activation.
	 *
	 * @since 1.6.0
	 *
	 * @param bool $network_wide Whether the activation was done network-wide.
	 */
	public function on_plugin_activation( bool $network_wide ): void {
		$this->run_upgrades();
	}

	/**
	 * Act on site initialization.
	 *
	 * @since 1.11.0
	 *
	 * @param WP_Site $site The site being initialized.
	 */
	public function on_site_initialization( WP_Site $site ): void {
		$this->run_upgrades();
	}

	/**
	 * Run all upgrade routines in order.
	 *
	 * @since 1.11.0
	 */
	public function run_upgrades(): void {
		/**
		 * Current database version.
		 *
		 * @var string $version
		 */
		$version = get_option( self::OPTION, '0.0.0' );

		if ( '0.0.0' === $version ) {
			$this->finish_up( $version );
			return;
		}

		if ( version_compare( WEBSTORIES_DB_VERSION, $version, '=' ) ) {
			return;
		}

		$routines = self::ROUTINES;
		array_walk( $routines, [ $this, 'run_upgrade_routine' ], $version );
		$this->finish_up( $version );
	}

	/**
	 * Act on plugin uninstall.
	 *
	 * @since 1.26.0
	 */
	public function on_plugin_uninstall(): void {
		delete_option( self::PREVIOUS_OPTION );
		delete_option( self::OPTION );
	}

	/**
	 * Runs the upgrade routine.
	 *
	 * @since 1.0.0
	 *
	 * @param class-string $class_name The Class to call.
	 * @param string       $version         The new version.
	 * @param string       $current_version The current set version.
	 */
	protected function run_upgrade_routine( string $class_name, string $version, string $current_version ): void {
		if ( version_compare( $current_version, $version, '<' ) ) {
			/**
			 * Instance of a migration class.
			 *
			 * @var Migration $routine
			 */
			$routine = $this->injector->make( $class_name );
			$routine->migrate();
		}
	}

	/**
	 * Runs the needed cleanup after an update, setting the DB version to latest version, flushing caches etc.
	 *
	 * @since 1.0.0
	 *
	 * @param string $previous_version The previous version.
	 */
	protected function finish_up( string $previous_version ): void {
		update_option( self::PREVIOUS_OPTION, $previous_version );
		update_option( self::OPTION, WEBSTORIES_DB_VERSION );
	}
}
