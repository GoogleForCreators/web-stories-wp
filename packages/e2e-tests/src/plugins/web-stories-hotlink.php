<?php
/**
 * Plugin Name: E2E Tests Hotlink
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Hook into Hotlinking REST API controller to avoid making real requests.
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

/**
 * Hotwire the value of transient, so that a real request is not made.
 *
 * @return string
 */
function filter_transient_vtt_file(): string {
	$data = [
		'ext'       => 'vtt',
		'file_name' => 'test.vtt',
		'file_size' => '2000',
		'mime_type' => 'text/vtt',
		'type'      => 'caption',
	];

	return wp_json_encode( $data );
}

add_filter( 'pre_transient_web_stories_url_data_' . md5( content_url( '/e2e-assets/test.vtt' ) ), __NAMESPACE__ . '\filter_transient_vtt_file', 20 );

/**
 * Hotwire the value of transient, so that a real request is not made.
 *
 * @return string
 */
function filter_transient_jpg_file(): string {
	$data = [
		'ext'       => 'jpg',
		'file_name' => 'example-1.jpg',
		'file_size' => '381503',
		'mime_type' => 'image/jpeg',
		'type'      => 'image',
	];

	return wp_json_encode( $data );
}

add_filter( 'pre_transient_web_stories_url_data_' . md5( content_url( '/e2e-assets/example-1.jpg' ) ), __NAMESPACE__ . '\filter_transient_jpg_file', 20 );

/**
 * Hotwire the value of transient, so that a real request is not made.
 *
 * @return string
 */
function filter_transient_audio_file(): string {
	$data = [
		'ext'       => 'mp3',
		'file_name' => 'audio.mp3',
		'file_size' => '2000',
		'mime_type' => 'audio/mpeg',
		'type'      => 'audio',
	];

	return wp_json_encode( $data );
}

add_filter( 'pre_transient_web_stories_url_data_' . md5( content_url( '/e2e-assets/audio.mp3' ) ), __NAMESPACE__ . '\filter_transient_audio_file', 20 );
