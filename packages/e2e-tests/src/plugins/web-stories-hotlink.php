<?php

/**
 * Plugin Name: E2E Tests Hotlink hotwire
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Hotlink hotwire.
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

namespace Google\Web_Stories\E2E\Hotlink;

function get_filter_name( $url ){
	$cache_key = 'web_stories_url_data_' . md5( $url );
	return 'pre_transient_' . $cache_key;
}

/**
 * Hotwire the value of transient, so that a real request is not made.
 *
 * @return string
 */
function filter_caption_transient() {
	$data = [
		'ext'       => 'vtt',
		'file_name' => 'test.vtt',
		'file_size' => '2000',
		'mime_type' => 'text/vtt',
		'type'      => 'caption',
	];

	return wp_json_encode( $data );
}
$caption_filter_name = get_filter_name( content_url( '/e2e-assets/test.vtt' ) );
add_filter( $caption_filter_name, __NAMESPACE__ . '\filter_caption_transient', 20 );

/**
 * Hotwire the value of transient, so that a real request is not made.
 *
 * @return string
 */
function filter_audio_transient() {
	$data = [
		'ext'       => 'mp3',
		'file_name' => 'audio.mp3',
		'file_size' => '2000',
		'mime_type' => 'audio/mpeg',
		'type'      => 'audio',
	];

	return wp_json_encode( $data );
}
$audio_filter_name = get_filter_name( content_url( '/e2e-assets/audio.mp3' ) );
add_filter( $audio_filter_name, __NAMESPACE__ . '\filter_audio_transient', 20 );
