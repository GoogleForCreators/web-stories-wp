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

namespace Google\Web_Stories\Traits;

use Google\Web_Stories\Shortcode\Stories_Shortcode;
use function Google\Web_Stories\fields_states;
use function Google\Web_Stories\get_layouts;
use function Google\Web_Stories\get_stories_order;

/**
 * Trait Stories_Script_Data.
 *
 * @package Google\Web_Stories
 */
trait Stories_Script_Data {

	/**
	 * Script handle.
	 *
	 * @since 1.5.0
	 *
	 * @var string
	 */
	private $script_handle;

	/**
	 * Add the data via wp_localize_script.
	 *
	 * @since 1.5.0
	 *
	 * @return void
	 */
	public function enqueue() {
		if ( $this->script_handle && wp_script_is( $this->script_handle ) ) {
			wp_localize_script(
				$this->script_handle,
				'webStoriesData',
				$this->data()
			);
		}
	}

	/**
	 * Put some tinymce related data on the page.
	 *
	 * @since 1.5.0
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
			'tag'       => Stories_Shortcode::SHORTCODE_NAME,
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
