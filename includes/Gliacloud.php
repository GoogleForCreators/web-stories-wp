<?php
/**
 * Gliacloud class.
 *
 * Responsible for adding the stories gliacloud to WordPress admin.
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

namespace Google\Web_Stories;

use WP_Screen;

/**
 * Gliacloud class.
 */
class Gliacloud {
	/**
	 * Script handle.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'stories-gliacloud';

	/**
	 * Admin page hook suffix.
	 *
	 * @var string|false The gliacloud page's hook_suffix, or false if the user does not have the capability required.
	 */
	private $hook_suffix;

	/**
	 * Initializes the gliacloud logic.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'admin_menu', [ $this, 'add_menu_page' ] );
	}

	/**
	 * Returns the admin page's hook suffix.
	 *
	 * @return string|false The gliacloud page's hook_suffix, or false if the user does not have the capability required.
	 */
	public function get_hook_suffix() {
		return $this->hook_suffix;
	}

	/**
	 * Registers the gliacloud admin menu page.
	 *
	 * @return void
	 */
	public function add_menu_page() {
		$this->hook_suffix = add_submenu_page(
			'edit.php?post_type=' . Story_Post_Type::POST_TYPE_SLUG,
			__( 'Gliacloud', 'web-stories' ),
			__( 'Gliacloud', 'web-stories' ),
			'edit_posts',
			'stories-gliacloud',
			[ $this, 'render' ],
			4
		);
	}

	/**
	 * Renders the gliacloud page.
	 *
	 * @return void
	 */
	public function render() {
        if ( empty( $_POST ) ){
            $this->get();
        }else{
            $this->post();
        }
	}

    public function get() {
		?>
            <form method="post">
                <p><h3>link:</h3> <input type="text" name="link" ></p>
                <p><h3>template:</h3> <input type="text" name="template" ></p>
                <input type="submit">
            </form>
		<?php
    }

    public function post() {
		?>
            <?php echo $_POST['link']; ?>
            <?php echo $_POST['template']; ?>
		<?php
    }
}



