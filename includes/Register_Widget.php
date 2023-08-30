<?php
/**
 * Class Register_Widget.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
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

declare(strict_types = 1);

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
	private Stories $stories;

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
	 */
	public function register(): void {
		add_action( 'widgets_init', [ $this, 'register_widgets' ] );
		add_filter( 'widget_types_to_hide_from_legacy_widget_block', [ $this, 'hide_widget' ] );
		add_filter( 'body_class', [ $this, 'body_class' ] );
	}

	/**
	 * Register widget.
	 *
	 * @since 1.9.0
	 */
	public function register_widgets(): void {
		register_widget( $this->stories );
	}

	/**
	 * Hide widget stories from legacy widget list.
	 *
	 * @since 1.9.0
	 *
	 * @param array|mixed $widget_types An array of excluded widget-type IDs.
	 * @return array|mixed
	 *
	 * @template T
	 *
	 * @phpstan-return ($widget_types is array<T> ? array<T> : mixed)
	 */
	public function hide_widget( $widget_types ) {
		if ( ! \is_array( $widget_types ) ) {
			return $widget_types;
		}
		$widget_types[] = $this->stories->id_base;

		return $widget_types;
	}

	/**
	 * Filters the list of CSS body class names for embedded iframes to add a class.
	 *
	 * @since 1.9.0
	 *
	 * @param string[]|mixed $classes An array of body class names.
	 * @return array|mixed
	 *
	 * @template T
	 *
	 * @phpstan-return ($classes is array<T> ? array<T> : mixed)
	 */
	public function body_class( $classes ) {
		if ( ! \is_array( $classes ) ) {
			return $classes;
		}
		if ( is_admin() && \defined( 'IFRAME_REQUEST' ) && IFRAME_REQUEST ) {
			$classes[] = 'ws-legacy-widget-preview';
		}

		return $classes;
	}
}
