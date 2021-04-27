<?php
/**
 * Class Database_Upgrader
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

use Google\Web_Stories\Infrastructure\Activateable;
use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Infrastructure\Service;

/**
 * Class Database_Upgrader
 *
 * @package Google\Web_Stories
 */
class Database_Upgrader extends Service_Base implements Activateable {

	/**
	 * The slug of database option.
	 *
	 * @var string
	 */
	const OPTION = 'web_stories_db_version';

	/**
	 * The slug of database option.
	 *
	 * @var string
	 */
	const PREVIOUS_OPTION = 'web_stories_previous_db_version';

	/**
	 * Array of classes to run migration routines.
	 *
	 * @var array
	 */
	const ROUTINES = [
		'1.0.0' => Migrations\Update_1::class,
		'2.0.0' => Migrations\Replace_Conic_Style_Presets::class,
		'2.0.1' => Migrations\Add_Media_Source_Editor::class,
		'2.0.2' => Migrations\Remove_Broken_Text_Styles::class,
		'2.0.3' => Migrations\Unify_Color_Presets::class,
		'2.0.4' => Migrations\Update_Publisher_Logos::class,
		'3.0.0' => Migrations\Add_Stories_Caps::class,
		'3.0.1' => Migrations\Rewrite_Flush::class,
		'3.0.2' => Migrations\Rewrite_Flush::class,
		'3.0.3' => Migrations\Yoast_Reindex_Stories::class,
		'3.0.4' => Migrations\Add_Poster_Generation_Media_Source::class,
		'3.0.5' => Migrations\Remove_Unneeded_Attachment_Meta::class,
		'3.0.6' => Migrations\Add_Media_Source_Video_Optimization::class,
		'3.0.7' => Migrations\Add_Media_Source_Source_Video::class,
	];

	/**
	 * Injector instance.
	 *
	 * @var Injector|Service Locale instance.
	 */
	private $injector;

	/**
	 * Hooked into admin_init and walks through an array of upgrade methods.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register() {
		$version = get_option( self::OPTION, '0.0.0' );

		if ( version_compare( WEBSTORIES_DB_VERSION, $version, '=' ) ) {
			return;
		}

		$this->injector = Services::get_injector();

		$routines = self::ROUTINES;
		array_walk( $routines, [ $this, 'run_upgrade_routine' ], $version );
		$this->finish_up( $version );
	}

	/**
	 * Activate the service.
	 *
	 * @param bool $network_wide Whether the activation was done network-wide.
	 * @return void
	 */
	public function activate( $network_wide ) {
		$this->register();
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action() {
		return 'admin_init';
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority() {
		return 5;
	}

	/**
	 * Runs the upgrade routine.
	 *
	 * @since 1.0.0
	 *
	 * @param string $class           The Class to call.
	 * @param string $version         The new version.
	 * @param string $current_version The current set version.
	 *
	 * @return void
	 */
	protected function run_upgrade_routine( $class, $version, $current_version ) {
		if ( version_compare( $current_version, $version, '<' ) ) {
			if ( ! method_exists( $this->injector, 'make' ) ) {
				return;
			}
			$routine = $this->injector->make( $class );
			$routine->migrate();
		}
	}

	/**
	 * Runs the needed cleanup after an update, setting the DB version to latest version, flushing caches etc.
	 *
	 * @since 1.0.0
	 *
	 * @param string $previous_version The previous version.
	 *
	 * @return void
	 */
	protected function finish_up( $previous_version ) {
		update_option( self::PREVIOUS_OPTION, $previous_version );
		update_option( self::OPTION, WEBSTORIES_DB_VERSION );
	}
}
