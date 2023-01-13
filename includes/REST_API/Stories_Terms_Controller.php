<?php
/**
 * Class Stories_Terms_Controller
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

declare(strict_types = 1);

namespace Google\Web_Stories\REST_API;

use WP_REST_Terms_Controller;
use WP_Term;

/**
 * Stories_Terms_Controller class.
 */
class Stories_Terms_Controller extends WP_REST_Terms_Controller {
	/**
	 * Override the existing prepare_links to ensure that all links have the correct namespace.
	 *
	 * @since 1.12.0
	 *
	 * @param WP_Term $term Term object.
	 * @return array<string, array{href?: string, taxonomy?: string, embeddable?: bool}> Links for the given term.
	 */
	protected function prepare_links( $term ): array {
		$links          = parent::prepare_links( $term );
		$links['about'] = [
			'href' => rest_url( sprintf( '%s/taxonomies/%s', $this->namespace, $this->taxonomy ) ),
		];

		return $links;
	}
}
