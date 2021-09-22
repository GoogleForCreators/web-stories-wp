<?php

namespace Google\Web_Stories\Tests\Integration\Fixture;

use Google\Web_Stories\REST_API\Stories_Terms_Controller;
use Google\Web_Stories\Taxonomy\Taxonomy_Base;

/**
 *
 */
class DummyTaxonomy extends Taxonomy_Base {
	/**
	 * @var string
	 */
	protected $taxonomy_slug = 'web-story-test-tax';
	/**
	 * @var string
	 */
	protected $taxonomy_post_type = 'post';

	/**
	 * @return array
	 */
	protected function taxonomy_args(): array {
		return [
			'show_in_rest'          => true,
			'rest_controller_class' => Stories_Terms_Controller::class,
		];
	}
}
