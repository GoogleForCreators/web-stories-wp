<?php
/**
 * Class AdSense
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

use Google\Web_Stories\Infrastructure\HasRequirements;

/**
 * Class AdSense
 */
class AdSense extends Service_Base implements HasRequirements {
	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private $settings;

	/**
	 * Analytics constructor.
	 *
	 * @since 1.12.0
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
	 * @since 1.3.0
	 */
	public function register(): void {
		add_action( 'web_stories_print_analytics', [ $this, 'print_adsense_tag' ] );
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because settings needs to be registered first.
	 *
	 * @since 1.13.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'settings' ];
	}

	/**
	 * Returns the Google AdSense publisher ID.
	 *
	 * @since 1.3.0
	 *
	 * @return string Publisher ID.
	 */
	private function get_publisher_id(): string {
		/**
		 * Publisher ID.
		 *
		 * @var string $publisher_id
		 */
		$publisher_id = $this->settings->get_setting( $this->settings::SETTING_NAME_ADSENSE_PUBLISHER_ID );
		return $publisher_id;
	}

	/**
	 * Returns the Google AdSense slot ID.
	 *
	 * @since 1.3.0
	 *
	 * @return string Slot ID.
	 */
	private function get_slot_id(): string {
		/**
		 * Slot ID.
		 *
		 * @var string
		 */
		$slot_id = $this->settings->get_setting( $this->settings::SETTING_NAME_ADSENSE_SLOT_ID );
		return $slot_id;
	}

	/**
	 * Returns if Google AdSense is enabled.
	 *
	 * @since 1.3.0
	 */
	private function is_enabled(): bool {
		return ( 'adsense' === $this->settings->get_setting( $this->settings::SETTING_NAME_AD_NETWORK, 'none' ) );
	}

	/**
	 * Prints the <amp-story-auto-ads> tag for single stories.
	 *
	 * @since 1.3.0
	 */
	public function print_adsense_tag(): void {
		$publisher = $this->get_publisher_id();
		$slot      = $this->get_slot_id();
		$enabled   = $this->is_enabled();

		if ( ! $enabled || ! $publisher || ! $slot ) {
			return;
		}
		?>
		<amp-story-auto-ads>
			<script type="application/json">
				{
					"ad-attributes": {
						"type": "adsense",
						"data-ad-client": "<?php echo esc_js( $publisher ); ?>",
						"data-ad-slot": "<?php echo esc_js( $slot ); ?>"
					}
				}
			</script>
		</amp-story-auto-ads>
		<?php
	}
}
