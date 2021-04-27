<?php
/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests;

use Google\Web_Stories\Story_Post_Type;

trait Capabilities_Setup {
	protected function get_story_object() {
		$experiments   = $this->createMock( \Google\Web_Stories\Experiments::class );
		$meta_boxes    = $this->createMock( \Google\Web_Stories\Meta_Boxes::class );
		$decoder       = $this->createMock( \Google\Web_Stories\Decoder::class );
		$locale        = $this->createMock( \Google\Web_Stories\Locale::class );
		$register_font = $this->createMock( \Google\Web_Stories\Register_Font::class );

		return new Story_Post_Type( $experiments, $meta_boxes, $decoder, $locale, $register_font );
	}

	public function add_caps_to_roles() {
		$story_post_type = $this->get_story_object();
		$story_post_type->add_caps_to_roles();
	}

	public function remove_caps_from_roles() {
		$story_post_type = $this->get_story_object();
		$story_post_type->remove_caps_from_roles();
	}
}
