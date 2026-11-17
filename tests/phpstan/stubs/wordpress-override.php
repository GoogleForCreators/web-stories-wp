<?php

// See https://github.com/szepeviktor/phpstan-wordpress/issues/42

/**
 * Determines whether current WordPress query has posts to loop over.
 *
 * @phpstan-impure
 *
 * @since 1.5.0
 *
 * @global WP_Query $wp_query WordPress Query object.
 *
 * @return bool True if posts are available, false if end of the loop.
 */
function have_posts() {}

/**
 * Determines whether the taxonomy name exists.
 *
 * @phpstan-impure
 *
 * @since 3.0.0
 *
 * @global WP_Taxonomy[] $wp_taxonomies The registered taxonomies.
 *
 * @param string $taxonomy Name of taxonomy object.
 * @return bool Whether the taxonomy exists.
 * @phpstan-assert-if-true =non-falsy-string $taxonomy
 * @phpstan-return ($taxonomy is non-falsy-string ? bool : false)
 */
function taxonomy_exists( $taxonomy ) {}
