<?php
/**
 * Demo_Content class.
 *
 * Used for getting demo content.
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
 * Demo_Content class.
 */
class Demo_Content {
	/**
	 * Returns the title for the demo story.
	 */
	public function get_title(): string {
		return __( 'Tips to make the most of Web Stories', 'web-stories' );
	}

	/**
	 * Returns the content for the demo story.
	 */
	public function get_content(): string {
		$content = $this->load_demo_content_from_file();
		$content = $this->localize_texts( $content );
		$content = $this->update_assets_urls( $content );

		// Quick sanity check to see if the JSON is still valid.
		if ( null === json_decode( $content, true ) ) {
			return '';
		}

		return $content;
	}

	/**
	 * Updates URLs to media assets in demo content.
	 *
	 * @param string $content Original content.
	 * @return string Modified content.
	 */
	private function update_assets_urls( string $content ): string {
		$content = str_replace(
			'https://replaceme.com/',
			trailingslashit( WEBSTORIES_CDN_URL ),
			$content
		);

		return $content;
	}

	/**
	 * Localizes demo content.
	 *
	 * @param string $content Original content.
	 * @return string Localized text.
	 */
	private function localize_texts( string $content ): string {
		$replacements = [
			// Page 1.
			'L10N_PLACEHOLDER_1_1' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Tips to make the most of the Web Stories Editor', 'demo content', 'web-stories' ),

			// Page 2.

			'L10N_PLACEHOLDER_2_1' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Set a page background', 'demo content', 'web-stories' ),

			'L10N_PLACEHOLDER_2_2' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Drag your image or video to the edge of the page to set as page background.', 'demo content', 'web-stories' ),

			// Page 3.

			'L10N_PLACEHOLDER_3_1' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Media Edit Mode', 'demo content', 'web-stories' ),

			'L10N_PLACEHOLDER_3_2' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Double-click the image/video to resize, re-center or crop. Note: media set as page background cannot be cropped.', 'demo content', 'web-stories' ),

			// Page 4.

			'L10N_PLACEHOLDER_4_1' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Background Overlay', 'demo content', 'web-stories' ),

			'L10N_PLACEHOLDER_4_2' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Once you\'ve set a page bg, add a solid, linear or radial gradient overlay to increase text contrast or add visual styling.', 'demo content', 'web-stories' ),

			// Page 5.

			'L10N_PLACEHOLDER_5_1' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Safe Zone', 'demo content', 'web-stories' ),

			'L10N_PLACEHOLDER_5_2' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Add your designs to the page, keeping crucial elements inside the safe zone to ensure they are visible across most devices.', 'demo content', 'web-stories' ),

			// Page 6.

			'L10N_PLACEHOLDER_6_1' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Story System Layer', 'demo content', 'web-stories' ),

			'L10N_PLACEHOLDER_6_2' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'The system layer is docked at the top. Preview your story to ensure system layer icons are not blocking crucial elements.', 'demo content', 'web-stories' ),

			// Page 7.

			'L10N_PLACEHOLDER_7_1' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Shapes and Masks', 'demo content', 'web-stories' ),

			'L10N_PLACEHOLDER_7_2' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Our shapes are quite basic for now but they act as masks. Drag an image or video into the mask.', 'demo content', 'web-stories' ),

			// Page 8.

			'L10N_PLACEHOLDER_8_1' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Embed Visual Stories', 'demo content', 'web-stories' ),

			'L10N_PLACEHOLDER_8_2' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Embed stories into your blog post. Open the block menu & select the Web Stories block. Insert the story link to embed your story. That\'s it!', 'demo content', 'web-stories' ),

			// Page 9.

			'L10N_PLACEHOLDER_9_1' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Read about best practices for creating successful Web Stories', 'demo content', 'web-stories' ),

			'L10N_PLACEHOLDER_9_2' => /* translators: demo content used in the "Get Started" story */
				esc_url( _x( 'https://amp.dev/documentation/guides-and-tutorials/start/create_successful_stories/', 'demo content', 'web-stories' ) ),

			'L10N_PLACEHOLDER_9_3' => /* translators: demo content used in the "Get Started" story */
				esc_html_x( 'Best Practices', 'demo content', 'web-stories' ),
		];

		foreach ( $replacements as $search => $replacement ) {
			$content = str_replace( $search, $replacement, $content );
		}

		return $content;
	}

	/**
	 * Loads demo content from JSON file.
	 */
	private function load_demo_content_from_file(): string {
		$file = WEBSTORIES_PLUGIN_DIR_PATH . 'includes/data/stories/demo.json';

		if ( ! is_readable( $file ) ) {
			return '';
		}

		$content = file_get_contents( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents, WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown

		if ( ! $content ) {
			return '';
		}

		return $content;
	}
}
