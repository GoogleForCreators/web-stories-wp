<?php
/**
 * Class Experiments
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

namespace Google\Web_Stories;

use Google\Web_Stories\Infrastructure\HasRequirements;

/**
 * Experiments class.
 *
 * Allows turning flags on/off via the admin UI.
 */
class Experiments extends Service_Base implements HasRequirements {
	/**
	 * Settings page name.
	 */
	public const PAGE_NAME = 'web-stories-experiments';

	/**
	 * Settings instance.
	 *
	 * @var Settings Settings instance.
	 */
	private $settings;

	/**
	 * Experiments constructor.
	 *
	 * @since 1.12.0
	 *
	 * @param Settings $settings Settings instance.
	 * @return void
	 */
	public function __construct( Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * Initializes experiments
	 */
	public function register(): void {
		if ( WEBSTORIES_DEV_MODE ) {
			add_action( 'admin_menu', [ $this, 'add_menu_page' ], 25 );
			add_action( 'admin_init', [ $this, 'initialize_settings' ] );
		}
	}

	/**
	 * Get the list of service IDs required for this service to be registered.
	 *
	 * Needed because settings needs to be registered first.
	 *
	 * @since 1.13.0
	 *
	 * @return string[] List of required services.
	 */
	public static function get_requirements(): array {
		return [ 'settings' ];
	}

	/**
	 * Registers the experiments admin menu page.
	 *
	 * @since 1.0.0
	 */
	public function add_menu_page(): void {
		add_submenu_page(
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
	 */
	public function render(): void {
		require_once WEBSTORIES_PLUGIN_DIR_PATH . 'includes/templates/admin/experiments.php';
	}

	/**
	 * Initializes the experiments settings page.
	 *
	 * @since 1.0.0
	 */
	public function initialize_settings(): void {
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
					'default' => \array_key_exists( 'default', $experiment ) && $experiment['default'],
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
	 */
	public function display_experiment_field( array $args ): void {
		$is_enabled_by_default = ! empty( $args['default'] );
		$checked               = $is_enabled_by_default || $this->is_experiment_enabled( $args['id'] );
		$disabled              = $is_enabled_by_default ? 'disabled' : '';
		?>
		<label for="<?php echo esc_attr( $args['id'] ); ?>">
			<input
				type="checkbox"
				name="<?php echo esc_attr( sprintf( '%1$s[%2$s]', $this->settings::SETTING_NAME_EXPERIMENTS, $args['id'] ) ); ?>"
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
	 */
	public function display_experiment_section(): void {
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
				'default'     => true,
			],
			/**
			 * Author: @spacedmonkey
			 * Issue: #10339
			 * Creation date: 2022-02-02
			 */
			[
				'name'        => 'enablePostLockingTakeOver',
				'label'       => __( 'Story locking take over', 'web-stories' ),
				'description' => __( 'Allow locked stories to be taken over by another author', 'web-stories' ),
				'group'       => 'editor',
			],
			/**
			 * Author: @spacedmonkey
			 * Issue: #10706
			 * Creation date: 2022-03-07
			 */
			[
				'name'        => 'enableCORSCheck',
				'label'       => __( 'CORS check', 'web-stories' ),
				'description' => __( 'Add a check in the editor for CORS errors.', 'web-stories' ),
				'group'       => 'editor',
				'default'     => true,
			],
			/**
			 * Author: @brittanyirl
			 * Issue: #10115
			 * Creation date: 2022-02-02
			 */
			[
				'name'        => 'enableUpdatedPublishStoryModal',
				'label'       => __( 'Updated Publish Story Modal', 'web-stories' ),
				'description' => __( 'Enable new pre-publish confirmation modal', 'web-stories' ),
				'group'       => 'editor',
				'default'     => true,
			],

			/**
			 * Author: @miina
			 * Issue: #9880
			 * Creation date: 2021-12-15
			 */
			[
				'name'        => 'customFonts',
				'label'       => __( 'Custom Fonts', 'web-stories' ),
				'description' => __( 'Enable adding custom fonts', 'web-stories' ),
				'group'       => 'general',
				'default'     => true,
			],
			/**
			 * Author: @spacedmonkey
			 * Issue: #8821
			 * Creation date: 2022-01-19
			 */
			[
				'name'        => 'enhancedPageBackgroundAudio',
				'label'       => __( 'Page Background Audio', 'web-stories' ),
				'description' => __( 'Enable adding captions to background audio', 'web-stories' ),
				'group'       => 'editor',
				'default'     => true,
			],
			/**
			 * Author: @barklund
			 * Issue: #10112
			 * Creation date: 2022-01-27
			 */
			[
				'name'        => 'floatingMenu',
				'label'       => __( 'Floating Menu', 'web-stories' ),
				'description' => __( 'Enable the new floating design menu', 'web-stories' ),
				'group'       => 'editor',
				'default'     => true,
			],
			/**
			 * Author: @timarney
			 * Issue: #10014
			 * Creation date: 2022-03-03
			 */
			[
				'name'        => 'notifyDeletedFonts',
				'label'       => __( 'Deleted Fonts', 'web-stories' ),
				'description' => __( 'Notify user about deleted fonts in story', 'web-stories' ),
				'group'       => 'editor',
				'default'     => true,
			],
			/**
			 * Author: @swissspidy
			 * Issue: #10930
			 * Creation date: 2022-03-17
			 */
			[
				'name'        => 'mediaRecording',
				'label'       => __( 'Media Recording', 'web-stories' ),
				'description' => __( 'Enable recording from webcam/microphone', 'web-stories' ),
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
	protected function get_experiment( string $name ): ?array {
		$experiment = wp_list_filter( $this->get_experiments(), [ 'name' => $name ] );
		return ! empty( $experiment ) ? array_shift( $experiment ) : null;
	}

	/**
	 * Checks whether an experiment is enabled.
	 *
	 * @since 1.0.0
	 *
	 * @param string $name Experiment name.
	 * @return bool Whether the experiment is enabled.
	 */
	public function is_experiment_enabled( string $name ): bool {
		$experiment = $this->get_experiment( $name );

		if ( ! $experiment ) {
			return false;
		}

		if ( \array_key_exists( 'default', $experiment ) ) {
			return (bool) $experiment['default'];
		}

		/**
		 * List of enabled experiments.
		 *
		 * @var array<string, array> $experiments
		 */
		$experiments = $this->settings->get_setting( $this->settings::SETTING_NAME_EXPERIMENTS, [] );
		return ! empty( $experiments[ $name ] );
	}

	/**
	 * Returns the names of all enabled experiments.
	 *
	 * @since 1.4.0
	 *
	 * @return array List of all enabled experiments.
	 */
	public function get_enabled_experiments(): array {
		$experiments = array_filter(
			wp_list_pluck( $this->get_experiments(), 'name' ),
			[ $this, 'is_experiment_enabled' ]
		);

		return $experiments;
	}
}
