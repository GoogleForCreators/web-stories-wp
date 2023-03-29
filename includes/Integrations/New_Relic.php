<?php
/**
 * Class New_Relic
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
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

declare(strict_types = 1);

namespace Google\Web_Stories\Integrations;

use Google\Web_Stories\Context;
use Google\Web_Stories\Infrastructure\Conditional;
use Google\Web_Stories\Service_Base;

/**
 * New Relic integration class.
 *
 * @since 1.10.0
 */
class New_Relic extends Service_Base implements Conditional {
	/**
	 * Context instance.
	 *
	 * @var Context Context instance.
	 */
	private Context $context;

	/**
	 * Single constructor.
	 *
	 * @param Context $context Context instance.
	 */
	public function __construct( Context $context ) {
		$this->context = $context;
	}

	/**
	 * Runs on instantiation.
	 *
	 * @since 1.10.0
	 */
	public function register(): void {
		$this->disable_autorum();
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.10.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'template_redirect';
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.10.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int {
		// Run at the same time as the output buffering.

		// phpcs:ignore PHPCompatibility.Constants.NewConstants.php_int_minFound
		return \defined( 'PHP_INT_MIN' ) ? PHP_INT_MIN : ~PHP_INT_MAX;
	}

	/**
	 * Check whether the conditional object is currently needed.
	 *
	 * @since 1.10.0
	 *
	 * @return bool Whether the conditional object is needed.
	 */
	public static function is_needed(): bool {
		return \function_exists( '\newrelic_disable_autorum' );
	}

	/**
	 * Disable the New Relic Browser agent on AMP responses.
	 *
	 * This prevents the New Relic from causing invalid AMP responses due the NREUM script it injects after the meta charset:
	 *
	 * https://docs.newrelic.com/docs/browser/new-relic-browser/troubleshooting/google-amp-validator-fails-due-3rd-party-script
	 *
	 * Sites with New Relic will need to specially configure New Relic for AMP:
	 * https://docs.newrelic.com/docs/browser/new-relic-browser/installation/monitor-amp-pages-new-relic-browser
	 *
	 * @since 1.10.0
	 */
	public function disable_autorum(): void {
		if ( ! $this->context->is_web_story() ) {
			return;
		}

		\newrelic_disable_autorum();
	}
}
