<?php
/**
 * Class Experiments
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

/**
 * Experiments class.
 *
 * Allows turning flags on/off via the admin UI.
 */
class Experiments {
	/**
	 * Settings page name.
	 *
	 * @var string
	 */
	const PAGE_NAME = 'web-stories-experiments';

	/**
	 * Admin page hook suffix.
	 *
	 * @var string|false The experiments page's hook_suffix, or false if the user does not have the capability required.
	 */
	private $hook_suffix;

	/**
	 * Initializes experiments
	 *
	 * @return void
	 */
	public function init() {
		if ( WEBSTORIES_DEV_MODE ) {
			add_action( 'admin_menu', [ $this, 'add_menu_page' ], 25 );
			add_action( 'admin_init', [ $this, 'initialize_settings' ] );
		}
	}

	/**
	 * Registers the experiments admin menu page.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function add_menu_page() {
		$this->hook_suffix = add_submenu_page(
			'edit.php?post_type=' . Story_Post_Type::POST_TYPE_SLUG,
			__( 'Experiments', 'web-stories' ),
			__( 'Experiments', 'web-stories' ),
			'manage_options',
			'web-stories-experiments',
			[ $this, 'render' ],
			25
		);
	}

	/**
	 * Renders the experiments page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function render() {
		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/admin/experiments.php';
	}

	/**
	 * Initializes the experiments settings page.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function initialize_settings() {
		add_settings_section(
			'web_stories_experiments_section',
			// The empty string ensures the render function won't output a h2.
			'',
			[ $this, 'display_experiment_section' ],
			self::PAGE_NAME
		);

		foreach ( $this->get_experiment_groups() as $group => $label ) {
			add_settings_section(
				$group,
				$label,
				'__return_empty_string',
				self::PAGE_NAME
			);
		}

		$experiments = $this->get_experiments();

		foreach ( $experiments as $experiment ) {
			add_settings_field(
				$experiment['name'],
				$experiment['label'],
				[ $this, 'display_experiment_field' ],
				self::PAGE_NAME,
				$experiment['group'],
				[
					'label'   => $experiment['description'],
					'id'      => $experiment['name'],
					'default' => array_key_exists( 'default', $experiment ) && $experiment['default'],
				]
			);
		}
	}

	/**
	 * Display a checkbox field for a single experiment.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args {
	 *     Array of arguments for displaying a single field.
	 *
	 *     @type string $id      Experiment ID.
	 *     @type string $label   Experiment label.
	 *     @type bool   $default Whether the experiment is enabled by default.
	 * }
	 *
	 * @return void
	 */
	public function display_experiment_field( $args ) {
		$is_enabled_by_default = ! empty( $args['default'] );
		$checked               = $is_enabled_by_default || $this->is_experiment_enabled( $args['id'] );
		$disabled              = $is_enabled_by_default ? 'disabled' : '';
		?>
		<label for="<?php echo esc_attr( $args['id'] ); ?>">
			<input
				type="checkbox"
				name="<?php echo esc_attr( sprintf( '%1$s[%2$s]', Settings::SETTING_NAME_EXPERIMENTS, $args['id'] ) ); ?>"
				id="<?php echo esc_attr( $args['id'] ); ?>"
				value="1"
				<?php echo esc_attr( $disabled ); ?>
				<?php checked( $checked ); ?>
			/>
			<?php echo esc_html( $args['label'] ); ?>
		</label>
		<?php
	}

	/**
	 * Display the experiments section.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function display_experiment_section() {
		?>
		<p>
			<?php
			esc_html_e( "The Web Stories editor includes experimental features that are useable while they're in development. Select the ones you'd like to enable. These features are likely to change, so avoid using them in production.", 'web-stories' );
			?>
		</p>
		<?php
	}

	/**
	 * Returns all available experiment groups.
	 *
	 * @since 1.0.0
	 *
	 * @return array List of experiment groups
	 */
	public function get_experiment_groups() {
		return [
			'general'   => __( 'General', 'web-stories' ),
			'dashboard' => __( 'Dashboard', 'web-stories' ),
			'editor'    => __( 'Editor', 'web-stories' ),
		];
	}

	/**
	 * Returns a list of all experiments.
	 *
	 * @since 1.0.0
	 *
	 * @return array List of experiments by group.
	 */
	public function get_experiments() {
		return [
			/**
			 * Author: @littlemilkstudio
			 * Issue: 1897
			 * Creation date: 2020-05-21
			 */
			[
				'name'        => 'enableAnimation',
				'label'       => __( 'Animations', 'web-stories' ),
				'description' => __( 'Enable user facing animations', 'web-stories' ),
				'group'       => 'general',
			],
			/**
			 * Author: @carlos-kelly
			 * Issue: 2081
			 * Creation date: 2020-05-28
			 */
			[
				'name'        => 'enableInProgressViews',
				'label'       => __( 'Views', 'web-stories' ),
				'description' => __( 'Enable in-progress views to be accessed', 'web-stories' ),
				'group'       => 'dashboard',
			],
			/**
			 * Author: @brittanyirl
			 * Issue: 2344
			 * Creation date: 2020-06-10
			 */
			[
				'name'        => 'enableInProgressStoryActions',
				'label'       => __( 'Actions', 'web-stories' ),
				'description' => __( 'Enable in-progress story actions', 'web-stories' ),
				'group'       => 'dashboard',
			],
			/**
			 * Author: @brittanyirl
			 * Issue: 2381
			 * Creation date: 2020-06-11
			 */
			[
				'name'        => 'enableInProgressTemplateActions',
				'label'       => __( 'Template Actions', 'web-stories' ),
				'description' => __( 'Enable in-progress template actions', 'web-stories' ),
				'group'       => 'dashboard',
			],
			/**
			 * Author: @brittanyirl
			 * Issue: 2292
			 * Creation date: 2020-06-11
			 */
			[
				'name'        => 'enableBookmarkActions',
				'label'       => __( 'Bookmarks', 'web-stories' ),
				'description' => __( 'Enable bookmark actions', 'web-stories' ),
				'group'       => 'dashboard',
			],
			/**
			 * Author: @brittanyirl
			 * Issue: 3390
			 * Creation date: 2020-07-08
			 */
			[
				'name'        => 'enableTemplatePreviews',
				'label'       => __( 'Template Previews', 'web-stories' ),
				'description' => __( 'Enable template preview functionality', 'web-stories' ),
				'group'       => 'dashboard',
			],
			/**
			 * Author: @brittanyirl
			 * Issue: 3391
			 * Creation date: 2020-08-06
			 */
			[
				'name'        => 'enableStoryPreviews',
				'label'       => __( 'Story Previews', 'web-stories' ),
				'description' => __( 'Enable story preview functionality', 'web-stories' ),
				'group'       => 'dashboard',
			],
			/**
			 * Author: @dmmulroy
			 * Issue: #2092
			 * Creation date: 2020-06-04
			 */
			[
				'name'        => 'showAnimationTab',
				'label'       => __( 'Animations', 'web-stories' ),
				'description' => __( 'Enable animations tab', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @dmmulroy
			 * Issue: #2097
			 * Creation date: 2020-06-04
			 */
			[
				'name'        => 'showTextSets',
				'label'       => __( 'Text Sets', 'web-stories' ),
				'description' => __( 'Enable text sets', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @dmmulroy
			 * Issue: #2095
			 * Creation date: 2020-06-04
			 */
			[
				'name'        => 'showPrePublishTab',
				'label'       => __( 'Pre-Publish', 'web-stories' ),
				'description' => __( 'Enable pre-publish tab', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @dmmulroy
			 * Issue: #2044
			 * Creation date: 2020-06-04
			 */
			[
				'name'        => 'showTextMagicAndHelperMode',
				'label'       => __( 'Text Magic', 'web-stories' ),
				'description' => __( 'Enable text magic and helper mode icons', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @dmmulroy
			 * Issue: #2098
			 * Creation date: 2020-06-04
			 */
			[
				'name'        => 'showTextAndShapesSearchInput',
				'label'       => __( 'Library Search', 'web-stories' ),
				'description' => __( 'Enable search input on text and shapes tabs', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @diegovar
			 * Issue: #2616
			 * Creation date: 2020-06-23
			 */
			[
				'name'        => 'showElementsTab',
				'label'       => __( 'Elements tab', 'web-stories' ),
				'description' => __( 'Enable elements tab', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @diegovar
			 * Issue: #3206
			 * Creation date: 2020-07-15
			 */
			[
				'name'        => 'incrementalSearchDebounceMedia',
				'label'       => __( 'Incremental Search', 'web-stories' ),
				'description' => __( 'Enable incremental search in the Upload and Third-party media tabs.', 'web-stories' ),
				'group'       => 'editor',
			],
		];
	}

	/**
	 * Returns the experiment statuses for a given group.
	 *
	 * @since 1.0.0
	 *
	 * @param string $group Experiments group name.
	 *
	 * @return array Experiment statuses with name as key and status as value.
	 */
	public function get_experiment_statuses( $group ) {
		$experiments = wp_list_filter( $this->get_experiments(), [ 'group' => $group ] );

		if ( empty( $experiments ) ) {
			return [];
		}

		$result = [];

		foreach ( $experiments as $experiment ) {
			if ( array_key_exists( 'default', $experiment ) ) {
				$enabled = (bool) $experiment['default'];
			} else {
				$enabled = $this->is_experiment_enabled( $experiment['name'] );
			}

			$result[ $experiment['name'] ] = $enabled;
		}

		return $result;
	}

	/**
	 * Checks whether an experiment is enabled.
	 *
	 * @since 1.0.0
	 *
	 * @param string $name Experiment name.
	 *
	 * @return bool Whether the experiment is enabled.
	 */
	public function is_experiment_enabled( $name ) {
		$experiments = get_option( Settings::SETTING_NAME_EXPERIMENTS );
		return ! empty( $experiments[ $name ] );
	}
}
