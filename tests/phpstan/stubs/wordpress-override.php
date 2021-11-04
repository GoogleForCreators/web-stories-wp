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
