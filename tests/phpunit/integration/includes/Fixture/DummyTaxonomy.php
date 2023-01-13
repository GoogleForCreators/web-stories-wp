<?php

declare(strict_types = 1);

namespace Google\Web_Stories\Tests\Integration\Fixture;

use Google\Web_Stories\REST_API\Stories_Terms_Controller;
use Google\Web_Stories\Taxonomy\Taxonomy_Base;

/**
 * Dummy taxonomy.
 *
 * @phpstan-import-type TaxonomyArgs from \Google\Web_Stories\Taxonomy\Taxonomy_Base
 */
class DummyTaxonomy extends Taxonomy_Base {
	public function __construct() {
		$this->taxonomy_slug      = 'web-story-test-tax';
		$this->taxonomy_post_type = 'post';
	}

	/**
	 * @return TaxonomyArgs Taxonomy args.
	 */
	protected function taxonomy_args(): array {
		return [
			'show_in_rest'          => true,
			'rest_controller_class' => Stories_Terms_Controller::class,
			'rest_namespace'        => self::REST_NAMESPACE,
		];
	}
}
