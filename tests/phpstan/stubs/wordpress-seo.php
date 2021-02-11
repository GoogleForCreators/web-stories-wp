<?php
/*
 * @todo: Use php-stubs/wordpress-seo-stubs once stable.
 */

namespace {
	function YoastSEO() {}
}

namespace Yoast\WP\SEO {

	use Yoast\WP\SEO\Surfaces\Classes_Surface;

	class Main {
		/**
		 * @var Classes_Surface
		 */
		public $classes;
	}
}

namespace Yoast\WP\SEO\Surfaces {
	class Classes_Surface {
		/**
		 * Returns the instance of a class. Handy for unhooking things.
		 *
		 * @param string $class The class to get the instance of.
		 *
		 * @return mixed The instance of the class.
		 */
		public function get( $class ) {}
	}
}

namespace Yoast\WP\SEO\Models {
	class Indexable {
		/**
		 * @var string
		 */
		public $permalink;
	}
}

namespace Yoast\WP\SEO\Repositories {

	use Yoast\WP\SEO\Models\Indexable;

	class Indexable_Repository {
		/**
		 * Retrieves an indexable for a post type archive.
		 *
		 * @param string $post_type   The post type.
		 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
		 *
		 * @return false|Indexable The indexable, false if none could be found.
		 */
		public function find_for_post_type_archive( $post_type, $auto_create = true ) {}

		/**
		 * Retrieves an indexable by its ID and type.
		 *
		 * @param int    $object_id   The indexable object ID.
		 * @param string $object_type The indexable object type.
		 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
		 *
		 * @return false|Indexable Instance of indexable.
		 */
		public function find_by_id_and_type( $object_id, $object_type, $auto_create = true ) {}
	}
}

namespace Yoast\WP\SEO\Builders {

	use Yoast\WP\SEO\Models\Indexable;

	class Indexable_Builder {
		/**
		 * Creates an indexable for a post type archive.
		 *
		 * @param string         $post_type The post type.
		 * @param Indexable|bool $indexable Optional. An existing indexable to overwrite.
		 *
		 * @return Indexable The post type archive indexable.
		 */
		public function build_for_post_type_archive( $post_type, $indexable = false ) {}

		/**
		 * Creates an indexable by its ID and type.
		 *
		 * @param int            $object_id   The indexable object ID.
		 * @param string         $object_type The indexable object type.
		 * @param Indexable|bool $indexable   Optional. An existing indexable to overwrite.
		 *
		 * @return bool|Indexable Instance of indexable. False when unable to build.
		 */
		public function build_for_id_and_type( $object_id, $object_type, $indexable = false ) {}
	}
}
