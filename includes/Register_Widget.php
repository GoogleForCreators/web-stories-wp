<?php
/**
 * Class Register_Widget.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
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

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Widgets\Stories;

/**
 * Class RegisterWidget
 */
class Register_Widget implements Service, Registerable {
	/**
	 * Stories instance.
	 *
	 * @var Stories Stories instance.
	 */
	private $stories;

	/**
	 * Register_Widget constructor.
	 *
	 * @since 1.8.0
	 *
	 * @param Stories $stories Stories instance.
	 */
	public function __construct( Stories $stories ) {
		$this->stories = $stories;
	}

	/**
	 * Register Widgets.
	 *
	 * @since 1.6.0
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'widgets_init', [ $this, 'register_widget' ] );
		add_filter( 'widget_types_to_hide_from_legacy_widget_block', [ $this, 'hide_widget' ] );
		add_filter( 'body_class', [ $this, 'body_class' ] );
	}

	/**
	 * Register widget.
	 *
	 * @since 1.9.0
	 *
	 * @return void
	 */
	public function register_widget() {
		register_widget( $this->stories );
	}

	/**
	 * Hide widget stories from legacy widget list.
	 *
	 * @since 1.9.0
	 *
	 * @param array $widget_types An array of excluded widget-type IDs.
	 *
	 * @return array
	 */
	public function hide_widget( array $widget_types ) : array {
		$widget_types[] = $this->stories->id_base;

		return $widget_types;
	}

	/**
	 * Filters the list of CSS body class names for embedded iframes to add a class.
	 *
	 * @since 1.9.0
	 *
	 * @param string[] $classes An array of body class names.
	 *
	 * @return array
	 */
	public function body_class( array $classes ) : array {
		if ( is_admin() && defined( 'IFRAME_REQUEST' ) && IFRAME_REQUEST ) {
			$classes[] = 'ws-legacy-widget-preview';
		}

		return $classes;
	}
}
