<?php
/**
 * Class Analytics
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

/**
 * Class Analytics
 */
class Analytics extends Service_Base {
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
	 * @since 1.0.0
	 */
	public function register(): void {
		add_action( 'web_stories_print_analytics', [ $this, 'print_analytics_tag' ] );
	}

	/**
	 * Returns the  Google Analytics tracking ID.
	 *
	 * @since 1.0.0
	 *
	 * @return string Tracking ID.
	 */
	public function get_tracking_id(): string {
		/**
		 * Tracking ID.
		 *
		 * @var string $tracking_id
		 */
		$tracking_id = $this->settings->get_setting( $this->settings::SETTING_NAME_TRACKING_ID );
		return $tracking_id;
	}

	/**
	 * Returns the default analytics configuration.
	 *
	 * Note: variables in single quotes will be substituted by <amp-analytics>.
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @see https://github.com/ampproject/amphtml/blob/master/spec/amp-var-substitutions.md
	 *
	 * @param string $tracking_id Tracking ID.
	 * @return array<string, array> <amp-analytics> configuration.
	 */
	public function get_default_configuration( $tracking_id ): array {
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
						'event_name'     => 'custom',
						'event_action'   => 'story_progress',
						'event_category' => '${title}',
						'event_label'    => '${storyPageIndex}',
						'event_value'    => '${storyProgress}',
						'send_to'        => $tracking_id,
					],
				],
				// Fired when the last page in the story is shown to the user.
				// This can be used to measure completion rate.
				'storyEnd'            => [
					'on'      => 'story-last-page-visible',
					'request' => 'event',
					'vars'    => [
						'event_name'     => 'custom',
						'event_action'   => 'story_complete',
						'event_category' => '${title}',
						'event_label'    => '${storyPageCount}',
						'send_to'        => $tracking_id,
					],
				],
				// Fired when clicking an element that opens a tooltip (<a> or <amp-twitter>).
				'trackFocusState'     => [
					'on'      => 'story-focus',
					'tagName' => 'a',
					'request' => 'click ',
					'vars'    => [
						'event_name'     => 'custom',
						'event_action'   => 'story_focus',
						'event_category' => '${title}',
						'send_to'        => $tracking_id,
					],
				],
				// Fired when clicking on a tooltip.
				'trackClickThrough'   => [
					'on'      => 'story-click-through',
					'tagName' => 'a',
					'request' => 'click ',
					'vars'    => [
						'event_name'     => 'custom',
						'event_action'   => 'story_click_through',
						'event_category' => '${title}',
						'send_to'        => $tracking_id,
					],
				],
				// Fired when opening a drawer or dialog inside a story (e.g. page attachment).
				'storyOpen'           => [
					'on'      => 'story-open',
					'request' => 'event',
					'vars'    => [
						'event_name'     => 'custom',
						'event_action'   => 'story_open',
						'event_category' => '${title}',
						'send_to'        => $tracking_id,
					],
				],
				// Fired when closing a drawer or dialog inside a story (e.g. page attachment).
				'storyClose'          => [
					'on'      => 'story-close',
					'request' => 'event',
					'vars'    => [
						'event_name'     => 'custom',
						'event_action'   => 'story_close',
						'event_category' => '${title}',
						'send_to'        => $tracking_id,
					],
				],
				// Fired when the user initiates an interaction to mute the audio for the current story.
				'audioMuted'          => [
					'on'      => 'story-audio-muted',
					'request' => 'event',
					'vars'    => [
						'event_name'     => 'custom',
						'event_action'   => 'story_audio_muted',
						'event_category' => '${title}',
						'send_to'        => $tracking_id,
					],
				],
				// Fired when the user initiates an interaction to unmute the audio for the current story.
				'audioUnmuted'        => [
					'on'      => 'story-audio-unmuted',
					'request' => 'event',
					'vars'    => [
						'event_name'     => 'custom',
						'event_action'   => 'story_audio_unmuted',
						'event_category' => '${title}',
						'send_to'        => $tracking_id,
					],
				],
				// Fired when a page attachment is opened by the user.
				'pageAttachmentEnter' => [
					'on'      => 'story-page-attachment-enter',
					'request' => 'event',
					'vars'    => [
						'event_name'     => 'custom',
						'event_action'   => 'story_page_attachment_enter',
						'event_category' => '${title}',
						'send_to'        => $tracking_id,
					],
				],
				// Fired when a page attachment is dismissed by the user.
				'pageAttachmentExit'  => [
					'on'      => 'story-page-attachment-exit',
					'request' => 'event',
					'vars'    => [
						'event_name'     => 'custom',
						'event_action'   => 'story_page_attachment_exit',
						'event_category' => '${title}',
						'send_to'        => $tracking_id,
					],
				],
			],
		];

		/**
		 * Filters the Web Stories Google Analytics configuration.
		 *
		 * Only used when not using <amp-story-auto-analytics>, which is the default.
		 *
		 * @param array $config Analytics configuration.
		 */
		return apply_filters( 'web_stories_analytics_configuration', $config );
	}

	/**
	 * Prints the analytics tag for single stories.
	 *
	 * @since 1.0.0
	 */
	public function print_analytics_tag(): void {
		$tracking_id = $this->get_tracking_id();

		if ( ! $tracking_id ) {
			return;
		}

		if ( (bool) $this->settings->get_setting( $this->settings::SETTING_NAME_USING_LEGACY_ANALYTICS ) ) {
			$this->print_amp_analytics_tag( $tracking_id );
		} else {
			$this->print_amp_story_auto_analytics_tag( $tracking_id );
		}
	}

	/**
	 * Prints the legacy <amp-analytics> tag for single stories.
	 *
	 * @since 1.12.0
	 *
	 * @param string $tracking_id Tracking ID.
	 */
	private function print_amp_analytics_tag( $tracking_id ): void {
		?>
		<amp-analytics type="gtag" data-credentials="include">
			<script type="application/json">
				<?php echo wp_json_encode( $this->get_default_configuration( $tracking_id ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</script>
		</amp-analytics>
		<?php
	}

	/**
	 * Prints the <amp-story-auto-analytics> tag for single stories.
	 *
	 * @since 1.12.0
	 *
	 * @param string $tracking_id Tracking ID.
	 */
	private function print_amp_story_auto_analytics_tag( $tracking_id ): void {
		?>
		<amp-story-auto-analytics gtag-id="<?php echo esc_attr( $tracking_id ); ?>"></amp-story-auto-analytics>
		<?php
	}
}
