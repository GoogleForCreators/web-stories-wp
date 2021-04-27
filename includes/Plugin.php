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

use Google\Web_Stories\Infrastructure\ServiceBasedPlugin;
use Google\Web_Stories\Infrastructure\Injector;

/**
 * Plugin class.
 */
class Plugin extends ServiceBasedPlugin {

	/**
	 * The "plugin" is only a tool to hook arbitrary code up to the WordPress
	 * execution flow.
	 *
	 * The main structure we use to modularize our code is "services". These are
	 * what makes up the actual plugin, and they provide self-contained pieces
	 * of code that can work independently.
	 *
	 * @var boolean
	 */
	const ENABLE_FILTERS_DEFAULT = false;

	/**
	 * Prefix to use for all actions and filters.
	 *
	 * This is used to make the filters for the dependency injector unique.
	 *
	 * @var string
	 */
	const HOOK_PREFIX = 'web_stories_';

	/**
	 * List of services.
	 *
	 * The services array contains a map of <identifier> => <service class name>
	 * associations.
	 *
	 * @var string[]
	 */
	const SERVICES = [
		'activation_flag'              => Activation_Flag::class,
		'activation_notice'            => Activation_Notice::class,
		'adsense'                      => AdSense::class,
		'ad_manager'                   => Ad_Manager::class,
		'admin'                        => Admin::class,
		'analytics'                    => Analytics::class,
		'coi'                          => Admin\Cross_Origin_Isolation::class,
		'customizer'                   => Customizer::class,
		'dashboard'                    => Dashboard::class,
		'database_upgrader'            => Database_Upgrader::class,
		'discovery'                    => Discovery::class,
		'embed_base'                   => Embed_Base::class,
		'embed_shortcode'              => Shortcode\Embed_Shortcode::class,
		'experiments'                  => Experiments::class,
		'integrations.amp'             => Integrations\AMP::class,
		'integrations.jetpack'         => Integrations\Jetpack::class,
		'integrations.nextgen_gallery' => Integrations\NextGen_Gallery::class,
		'integrations.sitekit'         => Integrations\Site_Kit::class,
		'integrations.themes_support'  => Integrations\Core_Themes_Support::class,
		'kses'                         => KSES::class,
		'media'                        => Media::class,
		'page_template_post_type'      => Page_Template_Post_Type::class,
		'plugin_row_meta'              => Admin\PluginRowMeta::class,
		'plugin_action_links'          => Admin\PluginActionLinks::class,
		'meta_boxes'                   => Meta_Boxes::class,
		'settings'                     => Settings::class,
		'story_post_type'              => Story_Post_Type::class,
		'story_shortcode'              => Shortcode\Stories_Shortcode::class,
		'svg'                          => SVG::class,
		'template_post_type'           => Template_Post_Type::class,
		'tracking'                     => Tracking::class,
		'tinymce'                      => TinyMCE::class,
		'register.widget'              => Register_Widget::class,
		'rest.embed_controller'        => REST_API\Embed_Controller::class,
		'rest.link_controller'         => REST_API\Link_Controller::class,
		'rest.status_check_controller' => REST_API\Status_Check_Controller::class,
		'rest.stories_autosave'        => REST_API\Stories_Autosaves_Controller::class,
		'rest.stories_lock'            => REST_API\Stories_Lock_Controller::class,
		'rest.media'                   => REST_API\Stories_Media_Controller::class,
		'rest.settings'                => REST_API\Stories_Settings_Controller::class,
		'rest.users'                   => REST_API\Stories_Users_Controller::class,
		'rest.template_autosave'       => REST_API\Template_Autosaves_Controller::class,
		'rest.template_lock'           => REST_API\Template_Lock_Controller::class,
		'user_preferences'             => User_Preferences::class,
		'web_stories_block'            => Block\Web_Stories_Block::class,
	];

	/**
	 * Get the list of services to register.
	 *
	 * The services array contains a map of <identifier> => <service class name>
	 * associations.
	 *
	 * @since 1.6.0
	 *
	 * @return array<string> Associative array of identifiers mapped to fully
	 *                       qualified class names.
	 */
	protected function get_service_classes() {
		return self::SERVICES;
	}

	/**
	 * Get the bindings for the dependency injector.
	 *
	 * The bindings array contains a map of <interface> => <implementation>
	 * mappings, both of which should be fully qualified class names (FQCNs).
	 *
	 * The <interface> does not need to be the actual PHP `interface` language
	 * construct, it can be a `class` as well.
	 *
	 * Whenever you ask the injector to "make()" an <interface>, it will resolve
	 * these mappings and return an instance of the final <class> it found.
	 *
	 * @since 1.6.0
	 *
	 * @return array<string> Associative array of fully qualified class names.
	 */
	protected function get_bindings() {
		return [];
	}

	/**
	 * Get the shared instances for the dependency injector.
	 *
	 * The shared instances array contains a list of FQCNs that are meant to be
	 * reused. For multiple "make()" requests, the injector will return the same
	 * instance reference for these, instead of always returning a new one.
	 *
	 * This effectively turns these FQCNs into a "singleton", without incurring
	 * all the drawbacks of the Singleton design anti-pattern.
	 *
	 * @since 1.6.0
	 *
	 * @return array<string> Array of fully qualified class names.
	 */
	protected function get_shared_instances() {
		return [
			Experiments::class,
			Meta_Boxes::class,
			Locale::class,
			Activation_Flag::class,
			Integrations\Site_Kit::class,
			Analytics::class,
			Decoder::class,
			Register_Font::class,
		];
	}

	/**
	 * Get the delegations for the dependency injector.
	 *
	 * The delegations array contains a map of <class> => <callable>
	 * mappings.
	 *
	 * The <callable> is basically a factory to provide custom instantiation
	 * logic for the given <class>.
	 *
	 * @since 1.6.0
	 *
	 * @return array<callable> Associative array of callables.
	 */
	protected function get_delegations() {
		return [
			Injector::class => static function () {
				return Services::get( 'injector' );
			},
		];
	}

	/**
	 * Backward compatibility, old style class stored all classes instances as class properties.
	 * Use a magic getting to populate these class properties.
	 *
	 * @since 1.6.0
	 *
	 * @param string $name property name.
	 *
	 * @return mixed
	 */
	public function __get( $name ) {
		$services = $this->get_service_classes();
		if ( isset( $services[ $name ] ) ) {
			return $this->instantiate_service( $services[ $name ] );
		}

		if ( 'integrations' === $name ) {
			return [
				'webstories_core_themes_support' => $this->instantiate_service( $services['integrations.themes_support'] ),
				'site-kit'                       => $this->instantiate_service( $services['integrations.sitekit'] ),
				'nextgen_gallery'                => $this->instantiate_service( $services['integrations.nextgen_gallery'] ),
				'jetpack'                        => $this->instantiate_service( $services['integrations.jetpack'] ),
				'amp'                            => $this->instantiate_service( $services['integrations.amp'] ),
			];
		}

		return $this->$name;
	}
}
