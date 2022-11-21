<?php
/**
 * Interface HasMeta.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

declare(strict_types = 1);

namespace Google\Web_Stories\Infrastructure;

/**
 * Class registers meta.
 *
 * @internal
 *
 * @since 1.15.0
 */
interface HasMeta {
	/**
	 * Register meta
	 *
	 * @since 1.15.0
	 */
	public function register_meta(): void;
}
