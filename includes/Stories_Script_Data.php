<?php
/**
 * Stories script data class.
 *
 * Stories data which will be required by various JS scripts.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
 * Copyright 2021 Google LLC
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

/**
 * Class Stories_Script_Data.
 *
 * @package Google\Web_Stories
 */
class Stories_Script_Data {

	/**
	 * Script handle.
	 *
	 * @var string
	 */
	private $script_handle;

	/**
	 * Stories_Script_Data constructor.
	 *
	 * @param string $script_handle Script handle.
	 */
	public function __construct( $script_handle ) {
		$this->script_handle = $script_handle;
	}

	/**
	 * Add the data via wp_localize_script.
	 *
	 * @return void
	 */
	public function enqueue() {
		wp_localize_script(
			$this->script_handle,
			'webStoriesData',
			$this->data()
		);
	}

	/**
	 * Put some tinymce related data on the page.
	 *
	 * @return array
	 */
	private function data() {
		$order      = get_stories_order();
		$views      = get_layouts();
		$order_list = [];
		$view_types = [];

		foreach ( $order as $order_key => $an_order ) {
			$order_list[] = [
				'label' => $an_order,
				'value' => $order_key,
			];
		}

		foreach ( $views as $view_key => $view_label ) {
			$view_types[] = [
				'label' => $view_label,
				'value' => $view_key,
			];
		}

		$field_states = fields_states();

		$data = [
			'orderlist' => $order_list,
			'icon'      => trailingslashit( WEBSTORIES_ASSETS_URL ) . 'images/widget/carousel-icon.png',
			'tag'       => 'stories',
			'views'     => $view_types,
			'fields'    => $field_states,
		];

		/**
		 * Filter the script data.
		 *
		 * @param array $data Script data.
		 */
		return apply_filters( 'web_stories_script_data', $data );
	}

}
