<?php
/**
 * Main Plugin class.
 *
 * Responsible for initializing the plugin.
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

namespace Google\Web_Stories;

use Google\Web_Stories\AMP\Output_Buffer;
use Google\Web_Stories\Infrastructure\Injector;
use Google\Web_Stories\Infrastructure\ServiceBasedPlugin;
use Google\Web_Stories\Shopping\Shopping_Vendors;

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
	 */
	public const ENABLE_FILTERS_DEFAULT = false;

	/**
	 * Prefix to use for all actions and filters.
	 *
	 * This is used to make the filters for the dependency injector unique.
	 */
	public const HOOK_PREFIX = 'web_stories_';

	/**
	 * List of services.
	 *
	 * The services array contains a map of <identifier> => <service class name>
	 * associations.
	 */
	public const SERVICES = [
		'activation_notice'            => Admin\Activation_Notice::class,
		'admin.google_fonts'           => Admin\Google_Fonts::class,
		'amp_output_buffer'            => Output_Buffer::class,
		'amp_story_player_assets'      => AMP_Story_Player_Assets::class,
		'adsense'                      => AdSense::class,
		'ad_manager'                   => Ad_Manager::class,
		'admin'                        => Admin\Admin::class,
		'analytics'                    => Analytics::class,
		'coi'                          => Admin\Cross_Origin_Isolation::class,
		'customizer'                   => Admin\Customizer::class,
		'dashboard'                    => Admin\Dashboard::class,
		'database_upgrader'            => Database_Upgrader::class,
		'discovery'                    => Discovery::class,
		'editor'                       => Admin\Editor::class,
		'embed_shortcode'              => Shortcode\Embed_Shortcode::class,
		'experiments'                  => Experiments::class,
		'integrations.amp'             => Integrations\AMP::class,
		'integrations.jetpack'         => Integrations\Jetpack::class,
		'integrations.newrelic'        => Integrations\New_Relic::class,
		'integrations.nextgen_gallery' => Integrations\NextGen_Gallery::class,
		'integrations.cfi'             => Integrations\Conditional_Featured_Image::class,
		'integrations.sitekit'         => Integrations\Site_Kit::class,
		'integrations.themes_support'  => Integrations\Core_Themes_Support::class,
		'imgareaselect_patch'          => Admin\ImgAreaSelect_Patch::class,
		'kses'                         => KSES::class,
		'font_post_type'               => Font_Post_Type::class,
		'page_template_post_type'      => Page_Template_Post_Type::class,
		'plugin_row_meta'              => Admin\PluginRowMeta::class,
		'plugin_action_links'          => Admin\PluginActionLinks::class,
		'product_meta'                 => Shopping\Product_Meta::class,
		'media.base_color'             => Media\Base_Color::class,
		'media.blurhash'               => Media\Blurhash::class,
		'media.image_sizes'            => Media\Image_Sizes::class,
		'media.media_source'           => Media\Media_Source_Taxonomy::class,
		'media.video.captions'         => Media\Video\Captions::class,
		'media.video.muting'           => Media\Video\Muting::class,
		'media.video.optimization'     => Media\Video\Optimization::class,
		'media.video.poster'           => Media\Video\Poster::class,
		'media.video.trimming'         => Media\Video\Trimming::class,
		'media.video.is_gif'           => Media\Video\Is_Gif::class,
		'meta_boxes'                   => Admin\Meta_Boxes::class,
		'settings'                     => Settings::class,
		'site_health'                  => Admin\Site_Health::class,
		'story_archive'                => Story_Archive::class,
		'story_post_type'              => Story_Post_Type::class,
		'story_shortcode'              => Shortcode\Stories_Shortcode::class,
		'svg'                          => Media\SVG::class,
		'tracking'                     => Tracking::class,
		'tinymce'                      => Admin\TinyMCE::class,
		'register.widget'              => Register_Widget::class,
		'renderer.archives'            => Renderer\Archives::class,
		'renderer.single'              => Renderer\Single::class,
		'renderer.oembed'              => Renderer\Oembed::class,
		'renderer.feed'                => Renderer\Feed::class,
		'user.capabilities'            => User\Capabilities::class,
		'rest.embed_controller'        => REST_API\Embed_Controller::class,
		'rest.link_controller'         => REST_API\Link_Controller::class,
		'rest.hotlinking_controller'   => REST_API\Hotlinking_Controller::class,
		'rest.products'                => REST_API\Products_Controller::class,
		'rest.publisher_logos'         => REST_API\Publisher_Logos_Controller::class,
		'rest.status_check_controller' => REST_API\Status_Check_Controller::class,
		'rest.stories_autosave'        => REST_API\Stories_Autosaves_Controller::class,
		'rest.stories_lock'            => REST_API\Stories_Lock_Controller::class,
		'rest.media'                   => REST_API\Stories_Media_Controller::class,
		'rest.settings'                => REST_API\Stories_Settings_Controller::class,
		'rest.users'                   => REST_API\Stories_Users_Controller::class,
		'rest.taxonomies'              => REST_API\Stories_Taxonomies_Controller::class,
		'taxonomy.category'            => Taxonomy\Category_Taxonomy::class,
		'taxonomy.tag'                 => Taxonomy\Tag_Taxonomy::class,
		'user_preferences'             => User\Preferences::class,
		'web_stories_block'            => Block\Web_Stories_Block::class,
		'shortpixel_patch'          => Admin\ShortPixel_Patch::class,
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
	protected function get_service_classes(): array {
		return self::SERVICES;
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
	protected function get_shared_instances(): array {
		return [
			Admin\Customizer::class,
			Admin\Google_Fonts::class,
			Admin\Meta_Boxes::class,
			Analytics::class,
			Assets::class,
			Context::class,
			Decoder::class,
			Experiments::class,
			Story_Post_Type::class,
			Injector::class,
			Integrations\Site_Kit::class,
			Integrations\WooCommerce::class,
			Media\Types::class,
			Shopping_Vendors::class,
			Locale::class,
			Settings::class,
			Stories_Script_Data::class,
			User\Preferences::class,
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
	protected function get_delegations(): array {
		return [
			Injector::class => static function () {
				return Services::get( 'injector' );
			},
		];
	}
}
