<?php
/**
 * Class ShortPixel.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
 * Copyright 2022 Google LLC
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

use Google\Web_Stories\Service_Base;

/**
 * Class ShortPixel
 */
class ShortPixel extends Service_Base {

	/**
	 * Runs on instantiation.
	 *
	 * @since 1.23.0
	 */
	public function register(): void {
		add_filter( 'shortpixel_image_urls', [ $this, 'image_urls' ] );
	}

	/**
	 * Ensures page template urls bypass optimisation.
	 *
	 * @since 1.23.0
	 *
	 * @param string[] $urls  Urls that will be sent to optimisation.
	 * @return string[] The filtered Urls.
	 */
	public function image_urls( array $urls ): array {
		return array_filter(
			$urls,
			static fn( $url ) => ! str_contains( $url, 'web-stories-page-template' )
		);
	}
}
