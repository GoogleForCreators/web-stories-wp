<?php
/**
 * Class Ad_Manager
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
 * Class Ad_Manager
 */
class Ad_Manager extends Service_Base {
	/**
	 * Initializes all hooks.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'web_stories_print_analytics', [ $this, 'print_ad_manager_tag' ] );
	}

	/**
	 * Returns the Google Ad_Manager slot ID.
	 *
	 * @since 1.3.0
	 *
	 * @return string Slot ID.
	 */
	private function get_slot_id(): string {
		return (string) get_option( Settings::SETTING_NAME_AD_MANAGER_SLOT_ID );
	}

	/**
	 * Returns if Google manager is enabled.
	 *
	 * @since 1.3.0
	 *
	 * @return bool
	 */
	private function is_enabled(): bool {
		return ( 'admanager' === (string) get_option( Settings::SETTING_NAME_AD_NETWORK, 'none' ) );
	}

	/**
	 * Prints the <amp-story-auto-ads> tag for single stories.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function print_ad_manager_tag() {
		$slot    = $this->get_slot_id();
		$enabled = $this->is_enabled();

		if ( ! $enabled || ! $slot ) {
			return;
		}

		$configuration = [
			'ad-attributes' => [
				'type'      => 'doubleclick',
				'data-slot' => $slot,
			],
		];

		/**
		 * Filters Google Ad Manager configuration passed to `<amp-story-auto-ads>`.
		 *
		 * @since 1.10.0
		 *
		 * @param array $settings Ad Manager configuration.
		 * @param string $slot Google Ad_Manager slot ID.
		 */
		$configuration = apply_filters( 'web_stories_ad_manager_configuration', $configuration, $slot );

		?>
		<amp-story-auto-ads>
			<script type="application/json">
				<?php echo wp_json_encode( $configuration, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ); ?>
			</script>
		</amp-story-auto-ads>
		<?php
	}
}
