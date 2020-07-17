<?php
/**
 * Template for the Embed block's amp-iframe proxy.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

use Google\Web_Stories\Embed_Block;

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

$current_post = get_post();

if ( ! $current_post instanceof WP_Post ) {
	return;
}

$blocks = parse_blocks( $current_post->post_content );

$result = null;

// phpcs:ignore WordPress.Security.NonceVerification.Recommended
$index = isset( $_GET['_web_story_embed_proxy'] ) ? absint( $_GET['_web_story_embed_proxy'] ) : null;
$count = 0;
foreach ( $blocks as $block ) {
	if ( Embed_Block::BLOCK_NAME !== $block['blockName'] ) {
		continue;
	}

	$count++;

	if ( $count === $index ) {
		$result = $block;
		break;
	}
}

if ( null === $result ) {
	return;
}

$document_title = ! empty( $result['attrs']['title'] ) ? $result['attrs']['title'] : __( 'Web Story', 'web-stories' );

?>
<!DOCTYPE html>
<html>
<head>
	<title><?php echo esc_html( $document_title ); ?></title>
	<meta name="robots" content="noindex"/>
	<?php rel_canonical(); ?>
	<script async src="https://cdn.ampproject.org/amp-story-player-v0.js"></script>
	<link href="https://cdn.ampproject.org/amp-story-player-v0.css" rel="stylesheet" type="text/css" />
</head>
<body><?php echo render_block( $result ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></body>
</html>
