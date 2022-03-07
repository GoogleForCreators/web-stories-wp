<?php
/**
 * Class Story_Sanitizer.
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

namespace Google\Web_Stories\AMP;

use Google\Web_Stories\AMP\Traits\Sanitization_Utils;
use Google\Web_Stories_Dependencies\AMP_Base_Sanitizer;

/**
 * Story sanitizer.
 *
 * Sanitizer for Web Stories related features.
 *
 * @since 1.1.0
 */
class Story_Sanitizer extends AMP_Base_Sanitizer {
	use Sanitization_Utils;

	/**
	 * Sanitize the HTML contained in the DOMDocument received by the constructor.
	 *
	 * @since 1.1.0
	 */
	public function sanitize(): void {
		$this->transform_html_start_tag( $this->dom );
		$this->transform_a_tags( $this->dom );
		$this->use_semantic_heading_tags( $this->dom );
		$this->add_publisher_logo( $this->dom, $this->args['publisher_logo'] );
		$this->add_publisher( $this->dom, $this->args['publisher'] );
		$this->add_poster_images( $this->dom, $this->args['poster_images'] );
		// This needs to be called before use_semantic_heading_tags() because it relies on the style attribute.
		$this->deduplicate_inline_styles( $this->dom );
		$this->add_video_cache( $this->dom, $this->args['video_cache'] );
		$this->remove_blob_urls( $this->dom );
		$this->sanitize_srcset( $this->dom );
		$this->sanitize_amp_story_page_outlink( $this->dom );
		$this->remove_page_template_placeholder_images( $this->dom );
	}
}
