<?php
/**
 * Class Mgid
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2023 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2023 Google LLC
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

use Google\Web_Stories\Infrastructure\HasRequirements;

/**
 * Class MGID
 */
class Mgid extends Service_Base implements HasRequirements {
	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private Settings $settings;

	/**
	 * Analytics constructor.
	 *
	 * @since 1.33.0
	 *
	 * @param Settings $settings Settings instance.
	 * @return void
	 */
	public function __construct( Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Initializes all hooks.
	 *
	 * @since 1.33.0
	 */
	public function register(): void {
		add_action( 'web_stories_print_analytics', [ $this, 'print_mgid_tag' ] );
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because settings needs to be registered first.
	 *
	 * @since 1.33.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'settings' ];
	}

	/**
	 * Prints the <amp-story-auto-ads> tag for single stories.
	 *
	 * @since 1.33.0
	 */
	public function print_mgid_tag(): void {
		$widget  = $this->get_widget_id();
		$enabled = $this->is_enabled();

		if ( ! $enabled || ! $widget ) {
			return;
		}

		$configuration = [
			'ad-attributes' => [
				'type'        => 'mgid',
				'data-widget' => $widget,
			],
		];

		/**
		 * Filters MGID configuration passed to `<amp-story-auto-ads>`.
		 *
		 * @since 1.33.0
		 *
		 * @param array $settings MGID configuration.
		 * @param string $widget MGID Widget ID.
		 */
		$configuration = apply_filters( 'web_stories_mgid_configuration', $configuration, $widget );

		?>
		<amp-story-auto-ads>
			<script type="application/json">
				<?php echo wp_json_encode( $configuration, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); ?>
			</script>
		</amp-story-auto-ads>
		<?php
	}

	/**
	 * Returns the MGID Widget ID.
	 *
	 * @since 1.33.0
	 *
	 * @return string Widget ID.
	 */
	private function get_widget_id(): string {
		/**
		 * Widget ID.
		 *
		 * @var string
		 */
		return $this->settings->get_setting( $this->settings::SETTING_NAME_MGID_WIDGET_ID );
	}

	/**
	 * Returns if MGID is enabled.
	 *
	 * @since 1.33.0
	 */
	private function is_enabled(): bool {
		return ( 'mgid' === $this->settings->get_setting( $this->settings::SETTING_NAME_AD_NETWORK, 'none' ) );
	}
}
