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
class Experiments extends Service_Base {
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
	public function register() {
		if ( WEBSTORIES_DEV_MODE ) {
			add_action( 'admin_menu', [ $this, 'add_menu_page' ], 25 );
			add_action( 'admin_init', [ $this, 'initialize_settings' ] );
		}
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.6.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int {
		return 7;
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
	public function display_experiment_field( array $args ) {
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
	public function get_experiment_groups(): array {
		return [
			'general'   => __( 'General', 'web-stories' ),
			'dashboard' => __( 'Dashboard', 'web-stories' ),
			'editor'    => __( 'Editor', 'web-stories' ),
		];
	}

	/**
	 * Returns a list of all experiments.
	 *
	 * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
	 *
	 * @since 1.0.0
	 *
	 * @return array List of experiments by group.
	 */
	public function get_experiments(): array {
		return [
			/**
			 * Author: @littlemilkstudio
			 * Issue: 6379
			 * Creation date: 2021-03-09
			 */
			[
				'name'        => 'enableExperimentalAnimationEffects',
				'label'       => __( 'Experimental animations', 'web-stories' ),
				'description' => __( 'Enable any animation effects that are currently experimental', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @brittanyirl
			 * Issue: 2381
			 * Creation date: 2020-06-11
			 */
			[
				'name'        => 'enableInProgressTemplateActions',
				'label'       => __( 'Template actions', 'web-stories' ),
				'description' => __( 'Enable in-progress template actions', 'web-stories' ),
				'group'       => 'dashboard',
			],
			/**
			 * Author: @dmmulroy
			 * Issue: #2098
			 * Creation date: 2020-06-04
			 */
			[
				'name'        => 'showTextAndShapesSearchInput',
				'label'       => __( 'Library search', 'web-stories' ),
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
				'description' => __( 'Enable incremental search in the Upload and Third-party media tabs', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @spacedmonkey
			 * Issue: #798
			 * Creation date: 2020-11-02
			 */
			[
				'name'        => 'enableSVG',
				'label'       => __( 'SVG upload', 'web-stories' ),
				'description' => __( 'Enable SVG upload', 'web-stories' ),
				'group'       => 'general',
			],
			/**
			 * Author: @spacedmonkey
			 * Issue: #3126
			 * Creation date: 2021-02-02
			 */
			[
				'name'        => 'enablePostLocking',
				'label'       => __( 'Story locking', 'web-stories' ),
				'description' => __( 'Lock in-progress stories from being edited by other authors', 'web-stories' ),
				'group'       => 'general',
			],
			/**
			 * Author: @miina
			 * Issue #7986
			 * Creation date: 2021-07-08
			 */
			[
				'name'        => 'enableSmartTextColor',
				'label'       => __( 'Smart text color', 'web-stories' ),
				'description' => __( 'Enable text insertion with smart color ensuring good contrast with the background', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @merapi
			 * Issue #7995
			 * Creation date: 2021-08-13
			 */
			[
				'name'        => 'enableSmartTextSetsColor',
				'label'       => __( 'Smart text sets color', 'web-stories' ),
				'description' => __( 'Enable text sets insertion with smart color ensuring good contrast with the background', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @merapi
			 * Issue: #262
			 * Creation date: 2021-07-08
			 */
			[
				'name'        => 'enableEyedropper',
				'label'       => __( 'Eyedropper', 'web-stories' ),
				'description' => __( 'Enable choosing color using an eyedropper', 'web-stories' ),
				'group'       => 'editor',
				'default'     => true,
			],
			/**
			 * Author: @spacedmonkey
			 * Issue: #8811
			 * Creation date: 2021-09-06
			 */
			[
				'name'        => 'archivePageCustomization',
				'label'       => __( 'Archive Page', 'web-stories' ),
				'description' => __( 'Allow Web Stories archive page customization', 'web-stories' ),
				'group'       => 'general',
			],
			/**
			 * Author: @miina
			 * Issue #471
			 * Creation date: 2021-08-10
			 */
			[
				'name'        => 'enableHotlinking',
				'label'       => __( 'Insert media from link', 'web-stories' ),
				'description' => __( 'Enable inserting media element from external link', 'web-stories' ),
				'group'       => 'editor',
			],

			/**
			 * Author: @brookegraham
			 * Issue: #8832
			 * Creation date: 2021-08-30
			 */
			[
				'name'        => 'enableTaxonomiesSupport',
				'label'       => __( 'Taxonomies', 'web-stories' ),
				'description' => __( 'Enable support of tags and categories for stories', 'web-stories' ),
				'group'       => 'editor',
			],

			/**
			 * Author: @barklund
			 * Issue: #8877
			 * Creation date: 2021-09-01
			 */
			[
				'name'        => 'enableVideoTrim',
				'label'       => __( 'Video trimming', 'web-stories' ),
				'description' => __( 'Enable video trimming', 'web-stories' ),
				'group'       => 'editor',
			],

			/**
			 * Author: @barklund
			 * Issue: #8973
			 * Creation date: 2021-09-07
			 */
			[
				'name'        => 'enableThumbnailCaching',
				'label'       => __( 'Thumbnail Caching', 'web-stories' ),
				'description' => __( 'Enable thumbnail caching', 'web-stories' ),
				'group'       => 'editor',
			],

			/**
			 * Author: @swissspidy
			 * Issue: #7739
			 * Creation date: 2021-09-17
			 */
			[
				'name'        => 'enableAutoAnalyticsMigration',
				'label'       => __( 'Auto Analytics', 'web-stories' ),
				'description' => __( 'Enable migration option to story auto analytics', 'web-stories' ),
				'group'       => 'dashboard',
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
	public function get_experiment_statuses( string $group ): array {
		$experiments = wp_list_filter( $this->get_experiments(), [ 'group' => $group ] );

		if ( empty( $experiments ) ) {
			return [];
		}

		$result = [];

		foreach ( $experiments as $experiment ) {
			$result[ $experiment['name'] ] = $this->is_experiment_enabled( $experiment['name'] );
		}

		return $result;
	}

	/**
	 * Returns an experiment by name.
	 *
	 * @since 1.3.0
	 *
	 * @param string $name Experiment name.
	 * @return array|null Experiment if found, null otherwise.
	 */
	protected function get_experiment( string $name ) {
		$experiment = wp_list_filter( $this->get_experiments(), [ 'name' => $name ] );
		return ! empty( $experiment ) ? array_shift( $experiment ) : null;
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
	public function is_experiment_enabled( string $name ): bool {
		$experiment = $this->get_experiment( $name );

		if ( ! $experiment ) {
			return false;
		}

		if ( array_key_exists( 'default', $experiment ) ) {
			return (bool) $experiment['default'];
		}

		$experiments = get_option( Settings::SETTING_NAME_EXPERIMENTS );
		return ! empty( $experiments[ $name ] );
	}

	/**
	 * Returns the names of all enabled experiments.
	 *
	 * @since 1.4.0
	 *
	 * @return array List of all enabled experiments.
	 */
	public function get_enabled_experiments() {
		$experiments = array_filter(
			wp_list_pluck( $this->get_experiments(), 'name' ),
			[ $this, 'is_experiment_enabled' ]
		);

		return $experiments;
	}
}
