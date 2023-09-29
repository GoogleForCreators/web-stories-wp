<?php
/**
 * Plugin Name: E2E Tests Disable Gravatar
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Disable loading Gravatar to avoid CORS issues.
 * Author:      Google
 * Author URI:  https://opensource.google.com
 * License:     Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 *
 * @copyright 2023 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2023 Google LLC
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

namespace Google\Web_Stories\E2E\BlockDirectory;

// Hat tip https://github.com/norcross/airplane-mode

add_filter(
	'get_avatar',
	static function ( $avatar, $id_or_email, $size, $default, $alt ) {
		$image  = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
		return "<img alt='{$alt}' src='{$image}' class='avatar avatar-{$size} photo' height='{$size}' width='{$size}' style='background:#eee;' />";
	},
	1,
	5
);

add_filter(
	'get_avatar_url',
	static function ( $url ) {
		return set_url_scheme( $url, 'https' );
	},
	1
);
