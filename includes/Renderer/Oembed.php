<?php
/**
 * Class Oembed
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

namespace Google\Web_Stories\Renderer;

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Story_Post_Type;
use WP_Post;

/**
 * Class Oembed
 */
class Oembed extends Service_Base {

	/**
	 * Filter to render oembed.
	 *
	 * @since 1.7.0
	 */
	public function register(): void {
		add_filter( 'embed_template', [ $this, 'filter_embed_template' ] );
		add_filter( 'embed_html', [ $this, 'filter_embed_html' ], 10, 4 );
		// So it runs after get_oembed_response_data_rich().
		add_filter( 'oembed_response_data', [ $this, 'filter_oembed_response_data' ], 20, 3 );
	}

	/**
	 * Filters the path of the queried template by type.
	 *
	 * @since 1.7.0
	 *
	 * @param string|mixed $template  Path to the template. See locate_template().
	 * @return string|mixed $template
	 */
	public function filter_embed_template( $template ) {
		if ( get_post_type() === Story_Post_Type::POST_TYPE_SLUG ) {
			$template = WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/frontend/embed-web-story.php';
		}

		return $template;
	}

	/**
	 * Filters the embed code for a specific post.
	 *
	 * For stories, changes the aspect ratio from 16/9 to 3/5.
	 *
	 * @since 1.7.0
	 *
	 * @param string|mixed $output Embed code.
	 * @param WP_Post      $post Post object.
	 * @param int          $width  The width for the response.
	 * @param int          $height The height for the response.
	 * @return string|mixed Filtered embed code.
	 */
	public function filter_embed_html( $output, $post, $width, $height ) {
		if ( ! \is_string( $output ) ) {
			return $output;
		}

		if ( Story_Post_Type::POST_TYPE_SLUG !== $post->post_type ) {
			return $output;
		}

		if ( ! has_post_thumbnail( $post ) ) {
			return $output;
		}

		$new_data = $this->get_embed_height_width( $width );

		$new_width  = $new_data['width'];
		$new_height = $new_data['height'];

		$output = str_replace(
			[ "width=\"$width\"", "height=\"$height\"" ],
			[
				"width=\"$new_width\"",
				"height=\"$new_height\"",
			],
			$output
		);

		return $output;
	}

	/**
	 * Filters the oEmbed response data for a specific post.
	 *
	 * For stories, changes the aspect ratio from 16/9 to 3/5.
	 *
	 * @since 1.7.0
	 *
	 * @param array|mixed $data   The response data.
	 * @param WP_Post     $post   The post object.
	 * @param int         $width  The requested width.
	 * @return array|mixed The modified response data.
	 */
	public function filter_oembed_response_data( $data, $post, $width ) {
		if ( Story_Post_Type::POST_TYPE_SLUG !== $post->post_type ) {
			return $data;
		}

		if ( ! has_post_thumbnail( $post ) ) {
			return $data;
		}
		if ( ! \is_array( $data ) ) {
			return $data;
		}
		$new_data = $this->get_embed_height_width( $width );

		return array_merge( $data, $new_data );
	}

	/**
	 * Generate new height and width for embed.
	 *
	 * @since 1.7.0
	 *
	 * @param int $old_width Old width, used to generate new height and width.
	 * @return array
	 */
	protected function get_embed_height_width( $old_width ): array {
		/** This filter is documented in wp-includes/embed.php */
		$min_max_width = apply_filters(
			'oembed_min_max_width',
			[
				'min' => 200,
				'max' => 360,
			]
		);

		$width  = (int) min( max( $min_max_width['min'], (int) $old_width ), $min_max_width['max'] );
		$height = (int) max( ceil( $width / 3 * 5 ), 330 );

		return compact( 'width', 'height' );
	}
}
