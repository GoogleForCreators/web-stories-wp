<?php
/**
 * Class AdSense
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

/**
 * Class AdSense
 */
class AdSense extends Service_Base {
	/**
	 * Initializes all hooks.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'web_stories_print_analytics', [ $this, 'print_adsense_tag' ] );
	}

	/**
	 * Returns the Google AdSense publisher ID.
	 *
	 * @since 1.3.0
	 *
	 * @return string Publisher ID.
	 */
	private function get_publisher_id() {
		return (string) get_option( Settings::SETTING_NAME_ADSENSE_PUBLISHER_ID );
	}

	/**
	 * Returns the Google AdSense slot ID.
	 *
	 * @since 1.3.0
	 *
	 * @return string Slot ID.
	 */
	private function get_slot_id() {
		return (string) get_option( Settings::SETTING_NAME_ADSENSE_SLOT_ID );
	}

	/**
	 * Returns if Google AdSense is enabled.
	 *
	 * @since 1.3.0
	 *
	 * @return bool
	 */
	private function is_enabled() {
		return ( 'adsense' === (string) get_option( Settings::SETTING_NAME_AD_NETWORK, 'none' ) );
	}

	/**
	 * Prints the <amp-story-auto-ads> tag for single stories.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function print_adsense_tag() {
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
