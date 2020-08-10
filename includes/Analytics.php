<?php
/**
 * Class Analytics
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
 * Class Analytics
 */
class Analytics {
	/**
	 * Initializes all hooks.
	 *
	 * @return void
	 */
	public function init() {
		add_filter( 'googlesitekit_amp_gtag_opt', [ $this, 'filter_site_kit_gtag_opt' ] );
		add_action( 'web_stories_print_analytics', [ $this, 'print_analytics_tag' ] );
	}

	/**
	 * Determines whether the built-in Analytics module in Site Kit is active.
	 *
	 * @return bool Whether Site Kit's analytics module is active.
	 */
	protected function is_site_kit_analytics_module_active() {
		$modules = $this->get_site_kit_active_modules_option();

		return in_array( 'analytics', $modules, true );
	}

	/**
	 * Gets the option containing the active Site Kit modules.
	 *
	 * Checks two options as it was renamed at some point in Site Kit.
	 *
	 * Bails early if the Site Kit plugin itself is not active.
	 *
	 * @see \Google\Site_Kit\Core\Modules\Modules::get_active_modules_option
	 *
	 * @return array List of active module slugs.
	 */
	private function get_site_kit_active_modules_option() {
		if ( ! defined( 'GOOGLESITEKIT_VERSION' ) ) {
			return [];
		}

		$option = get_option( 'googlesitekit_active_modules' );

		if ( is_array( $option ) ) {
			return $option;
		}

		$legacy_option = get_option( 'googlesitekit-active-modules' );

		if ( is_array( $legacy_option ) ) {
			return $legacy_option;
		}

		return [];
	}

	/**
	 * Returns the  Google Analytics tracking ID.
	 *
	 * @return string Tracking ID.
	 */
	public function get_tracking_id() {
		return (string) get_option( Settings::SETTING_NAME_TRACKING_ID );
	}

	/**
	 * Returns the default analytics configuration.
	 *
	 * Note: variables in single quotes will be substituted by <amp-analytics>.
	 *
	 * @see https://github.com/ampproject/amphtml/blob/master/spec/amp-var-substitutions.md
	 *
	 * @return array <amp-analytics> configuration.
	 */
	public function get_default_configuration() {
		$tracking_id = $this->get_tracking_id();

		$config = [
			'vars'     => [
				'gtag_id' => $tracking_id,
				'config'  => [
					$tracking_id => [ 'groups' => 'default' ],
				],
			],
			'triggers' => [
				// Fired when a story page becomes visible.
				'storyProgress'       => [
					'on'      => 'story-page-visible',
					'request' => 'event',
					'vars'    => [
						'eventAction'   => 'story_progress',
						'eventCategory' => '${title}',
						'eventLabel'    => '${storyPageId}',
						'eventValue'    => '${storyProgress}',
					],
				],
				// Fired when the last page in the story is shown to the user.
				// This can be used to measure completion rate.
				'storyEnd'            => [
					'on'      => 'story-last-page-visible',
					'request' => 'event',
					'vars'    => [
						'eventAction'   => 'story_complete',
						'eventCategory' => '${title}',
					],
				],
				// Fired when clicking an element that opens a tooltip (<a> or <amp-twitter>).
				'trackFocusState'     => [
					'on'      => 'story-focus',
					'tagName' => 'a',
					'request' => 'click ',
				],
				// Fired when clicking on a tooltip.
				'trackClickThrough'   => [
					'on'      => 'story-click-through',
					'tagName' => 'a',
					'request' => 'click ',
				],
				// Fired when opening a drawer or dialog inside a story (e.g. page attachment).
				'storyOpen'           => [
					'on'      => 'story-open',
					'request' => 'event',
					'vars'    => [
						'eventAction'   => 'story_open',
						'eventCategory' => '${title}',
					],
				],
				// Fired when closing a drawer or dialog inside a story (e.g. page attachment).
				'storyClose'          => [
					'on'      => 'story-close',
					'request' => 'event',
					'vars'    => [
						'eventAction'   => 'story_close',
						'eventCategory' => '${title}',
					],
				],
				// Fired when the user initiates an interaction to mute the audio for the current story.
				'audioMuted'          => [
					'on'      => 'story-audio-muted',
					'request' => 'event',
					'vars'    => [
						'eventAction'   => 'story_audio_muted',
						'eventCategory' => '${title}',
					],
				],
				// Fired when the user initiates an interaction to unmute the audio for the current story.
				'audioUnmuted'        => [
					'on'      => 'story-audio-unmuted',
					'request' => 'event',
					'vars'    => [
						'eventAction'   => 'story_audio_unmuted',
						'eventCategory' => '${title}',
					],
				],
				// Fired when a page attachment is opened by the user.
				'pageAttachmentEnter' => [
					'on'      => 'story-page-attachment-enter',
					'request' => 'event',
					'vars'    => [
						'eventAction'   => 'story_page_attachment_enter',
						'eventCategory' => '${title}',
					],
				],
				// Fired when a page attachment is dismissed by the user.
				'pageAttachmentExit'  => [
					'on'      => 'story-page-attachment-exit',
					'request' => 'event',
					'vars'    => [
						'eventAction'   => 'story_page_attachment_exit',
						'eventCategory' => '${title}',
					],
				],
			],
		];

		return (array) apply_filters( 'web_stories_analytics_configuration', $config );
	}

	/**
	 * Prints the <amp-analytics> tag for single stories.
	 *
	 * @return void
	 */
	public function print_analytics_tag() {
		if ( $this->is_site_kit_analytics_module_active() ) {
			return;
		}

		if ( ! $this->get_tracking_id() ) {
			return;
		}
		?>
		<amp-analytics type="gtag" data-credentials="include">
			<script type="application/json">
				<?php echo wp_json_encode( $this->get_default_configuration() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</script>
		</amp-analytics>
		<?php
	}

	/**
	 * Filters Site Kit's Google Analytics configuration.
	 *
	 * @param array $gtag_opt Array of gtag configuration options.
	 * @return array Modified configuration options.
	 */
	public function filter_site_kit_gtag_opt( $gtag_opt ) {
		if ( ! is_singular( Story_Post_Type::POST_TYPE_SLUG ) ) {
			return $gtag_opt;
		}

		$default_config             = $this->get_default_configuration();
		$default_config['triggers'] = isset( $default_config['triggers'] ) ? $default_config['triggers'] : [];

		$gtag_opt['triggers'] = isset( $gtag_opt['triggers'] ) ? $gtag_opt['triggers'] : [];
		$gtag_opt['triggers'] = array_merge(
			$default_config['triggers'],
			$gtag_opt['triggers']
		);

		return $gtag_opt;
	}
}
