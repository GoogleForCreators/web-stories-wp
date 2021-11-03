<?php
/**
 * Interface HasMeta.
 *
 * @package   Google\Web_Stories
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

namespace Google\Web_Stories\Infrastructure;

/**
 * Class registers meta.
 *
 * @since 1.15.0
 * @internal
 */
interface HasMeta {
	/**
	 * Register meta
	 *
	 * @since 1.15.0
	 *
	 * @return void
	 */
	public function register_meta();
}
