<?php
/**
 * Template for web-story post type.
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

the_post();

use \Google\Web_Stories\Story_Post_Type;
use \Google\Web_Stories\Media;

?>
<!DOCTYPE html>
<html amp <?php language_attributes(); ?>>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
	<script async="" src="https://cdn.ampproject.org/v0.js"></script>
	<script src="https://cdn.ampproject.org/v0/amp-story-1.0.js" async="" custom-element="amp-story"></script>
	<script src="https://cdn.ampproject.org/v0/amp-fit-text-0.1.js" async="" custom-element="amp-fit-text"></script>
	<script src="https://cdn.ampproject.org/v0/amp-video-0.1.js" async="" custom-element="amp-video"></script>
	<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
	<noscript><style amp-boilerplate="">body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
	<?php /* todo: include custom CSS via PHP */ ?>
	<style amp-custom>
		.page-background-area, .page-safe-area {
			position: absolute;
			overflow: hidden;
			margin: auto;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
		}

		.page-background-area img, .page-background-area video {
			object-fit: cover;
		}

		.wrapper {
			position: absolute;
			overflow: hidden;
		}

		.fill {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: 0;
		}
	</style>

	<?php
	/**
	 * Prints scripts or data in the head tag on the front end.
	 *
	 * @since 1.3
	 */
	do_action( 'web_stories_story_head' );
	?>
</head>
<body>
<?php
// @todo Filter content in PHP to ensure AMP validity and to allow changing publisher logo etc.
the_content();
?>
</body>
</html>
