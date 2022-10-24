<?php
/**
 * Plugin Name: E2E Tests Embed
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Hook into embed REST API controller to avoid making real requests.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

namespace Google\Web_Stories\E2E\Embed;

/**
 * Hotwire the value of transient, so that a real request is not made.
 *
 * @return string
 */
function filter_transient(): string {
	$data = [
		'title'  => 'Stories in AMP - Hello World',
		'poster' => 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg',
	];

	return wp_json_encode( $data );
}

add_filter( 'pre_transient_web_stories_embed_data_' . md5( content_url( 'https://wp.stories.google/stories/intro-to-web-stories-storytime/' ) ), __NAMESPACE__ . '\filter_transient', 20 );

