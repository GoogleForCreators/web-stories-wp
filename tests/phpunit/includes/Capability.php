<?php

namespace Google\Web_Stories\Tests;

trait Capability {

	public static function add_capability( $user_id ) {
		$user = get_user_by( 'id', $user_id );
		$user->add_cap( 'edit_web-stories' );
	}
}
