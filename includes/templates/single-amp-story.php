<?php
/**
 * Template for amp_story post type.
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

?>
<!DOCTYPE html>
<html amp <?php language_attributes(); ?>>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">

	<?php
	/**
	 * Prints scripts or data in the head tag on the front end.
	 *
	 * @since 1.3
	 */
	do_action( 'amp_story_head' );
	?>
</head>
<body>
<?php
$metadata = function_exists( 'amp_get_schemaorg_metadata' ) ? amp_get_schemaorg_metadata() : [];
if ( isset( $metadata['publisher']['logo']['url'] ) ) {
	$publisher_logo_src = $metadata['publisher']['logo']['url'];
} elseif ( isset( $metadata['publisher']['logo'] ) && is_string( $metadata['publisher']['logo'] ) ) {
	$publisher_logo_src = $metadata['publisher']['logo'];
} else {
	$publisher_logo_src = admin_url( 'images/wordpress-logo.png' );
}
$publisher = isset( $metadata['publisher']['name'] ) ? $metadata['publisher']['name'] : get_option( 'blogname' );

$meta_images = [
	'poster-portrait' => '',
	'poster-square'   => '',
];

if ( class_exists( '\AMP_Story_Media' ) ) {
	$meta_images = AMP_Story_Media::get_story_meta_images();
}

?>
<amp-story
	standalone
	publisher-logo-src="<?php echo esc_url( $publisher_logo_src ); ?>"
	publisher="<?php echo esc_attr( $publisher ); ?>"
	title="<?php the_title_attribute(); ?>"
	poster-portrait-src="<?php echo esc_url( $meta_images['poster-portrait'] ); ?>"
	<?php if ( isset( $meta_images['poster-square'] ) ) : ?>
		poster-square-src="<?php echo esc_url( $meta_images['poster-square'] ); ?>"
	<?php endif; ?>
>
	<?php
	if ( function_exists( 'amp_print_story_auto_ads' ) ) {
		amp_print_story_auto_ads();
	}
	the_content();
	if ( function_exists( 'amp_print_analytics' ) ) {
		amp_print_analytics( '' );
	}
	?>
</amp-story>
</body>
</html>
