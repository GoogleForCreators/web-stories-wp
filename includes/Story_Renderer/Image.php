<?php
/**
 * Class Image
 *
 * @package   Google\Web_Stories\Story_Renderer
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


namespace Google\Web_Stories\Story_Renderer;

use Google\Web_Stories\Model\Story;

/**
 * Class Image
 *
 * @package Google\Web_Stories\Story_Renderer
 */
class Image {
	/**
	 * Current post.
	 *
	 * @var Story Post object.
	 */
	protected $story;


	/**
	 * Image constructor.
	 *
	 * @param Story $story   Story Object.
	 */
	public function __construct( Story $story ) {
		$this->story = $story;
	}

	/**
	 * Renders the block as an image.
	 *
	 * @param array $args Array of Argument to render.
	 *
	 * @return string Rendered block type output.
	 */
	public function render( array $args = [] ) {
		$defaults = [
			'align'  => 'none',
			'height' => 600,
			'width'  => 360,
		];
		$args     = wp_parse_args( $args, $defaults );
		$align    = sprintf( 'align%s', $args['align'] );

		ob_start();
		?>
		<div class="wp-block-web-stories-embed <?php echo esc_attr( $align ); ?>">
			<a href="<?php echo esc_url( $this->story->get_url() ); ?>">
				<?php
				if ( ! empty( $this->story->get_poster_portrait() ) ) {
					printf(
						'<img src="%1$s" width="%2$d" height="%3$d" alt="%4$s" />',
						esc_url( $this->story->get_poster_portrait() ),
						absint( $args['width'] ),
						absint( $args['height'] ),
						esc_attr( $this->story->get_title() )
					);
				} else {
					echo esc_html( $this->story->get_title() );
				}
				?>
			</a>
		</div>
		<?php

		return (string) ob_get_clean();
	}
}
