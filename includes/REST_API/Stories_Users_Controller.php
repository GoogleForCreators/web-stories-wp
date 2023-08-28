<?php
/**
 * Class Stories_Users_Controller
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

use Google\Web_Stories\Infrastructure\Delayed;
use Google\Web_Stories\Infrastructure\Registerable;
use Google\Web_Stories\Infrastructure\Service;
use Google\Web_Stories\Story_Post_Type;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Users_Controller;

/**
 * Stories_Users_Controller class.
 */
class Stories_Users_Controller extends WP_REST_Users_Controller implements Service, Delayed, Registerable {
	/**
	 * Story_Post_Type instance.
	 *
	 * @var Story_Post_Type Story_Post_Type instance.
	 */
	private Story_Post_Type $story_post_type;

	/**
	 * Constructor.
	 *
	 * Override the namespace.
	 *
	 * @since 1.2.0
	 *
	 * @param Story_Post_Type $story_post_type Story_Post_Type instance.
	 */
	public function __construct( Story_Post_Type $story_post_type ) {
		parent::__construct();
		$this->namespace = 'web-stories/v1';

		$this->story_post_type = $story_post_type;
	}

	/**
	 * Register the service.
	 *
	 * @since 1.7.0
	 */
	public function register(): void {
		$this->register_routes();
	}

	/**
	 * Get the action to use for registering the service.
	 *
	 * @since 1.7.0
	 *
	 * @return string Registration action to use.
	 */
	public static function get_registration_action(): string {
		return 'rest_api_init';
	}

	/**
	 * Get the action priority to use for registering the service.
	 *
	 * @since 1.7.0
	 *
	 * @return int Registration action priority to use.
	 */
	public static function get_registration_action_priority(): int {
		return 100;
	}

	/**
	 * Permissions check for getting all users.
	 *
	 * Allows edit_posts capabilities queries for stories if the user has the same cap,
	 * enabling them to see the users dropdown.
	 *
	 * @since 1.28.1
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access, otherwise WP_Error object.
	 */
	public function get_items_permissions_check( $request ) {
		/**
		 * The edit_posts capability.
		 *
		 * @var string $edit_posts
		 */
		$edit_posts = $this->story_post_type->get_cap_name( 'edit_posts' );

		if (
			! empty( $request['capabilities'] ) &&
			[ $edit_posts ] === $request['capabilities'] &&
			current_user_can( $edit_posts ) // phpcs:ignore WordPress.WP.Capabilities.Undetermined
		) {
			unset( $request['capabilities'] );
		}

		return parent::get_items_permissions_check( $request );
	}

	/**
	 * Retrieves all users.
	 *
	 * Includes a workaround for a shortcoming in WordPress core where
	 * only users with published posts are returned if not an admin
	 * and not using a 'who' -> 'authors' query, since we're using
	 * the recommended capabilities queries instead.
	 *
	 * @since 1.28.1
	 *
	 * @link https://github.com/WordPress/wordpress-develop/blob/008277583be15ee1738fba51ad235af5bbc5d721/src/wp-includes/rest-api/endpoints/class-wp-rest-users-controller.php#L308-L312
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		/**
		 * The edit_posts capability.
		 *
		 * @var string $edit_posts
		 */
		$edit_posts = $this->story_post_type->get_cap_name( 'edit_posts' );

		if (
			! isset( $request['has_published_posts'] ) &&
			! empty( $request['capabilities'] ) &&
			[ $edit_posts ] === $request['capabilities'] &&
			current_user_can( $edit_posts ) // phpcs:ignore WordPress.WP.Capabilities.Undetermined
		) {
			add_filter( 'rest_user_query', [ $this, 'filter_query_args' ] );
			$response = parent::get_items( $request );
			remove_filter( 'rest_user_query', [ $this, 'filter_query_args' ] );

			return $response;
		}

		return parent::get_items( $request );
	}

	/**
	 * Filters WP_User_Query arguments when querying users via the REST API.
	 *
	 * Removes 'has_published_posts' query argument.
	 *
	 * @since 1.28.1
	 *
	 * @param array<string,mixed> $prepared_args Array of arguments for WP_User_Query.
	 * @return array<string,mixed> Filtered query args.
	 */
	public function filter_query_args( array $prepared_args ): array {
		unset( $prepared_args['has_published_posts'] );

		return $prepared_args;
	}

	/**
	 * Checks if a given request has access to read a user.
	 *
	 * Same as the parent function but with using a cached version of {@see count_user_posts()}.
	 *
	 * @since 1.10.0
	 *
	 * @see WP_REST_Users_Controller::get_item_permissions_check()
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has read access for the item, otherwise WP_Error object.
	 */
	public function get_item_permissions_check( $request ) {
		/**
		 * User ID.
		 *
		 * @var int $user_id
		 */
		$user_id = $request['id'];

		$user = $this->get_user( $user_id );
		if ( is_wp_error( $user ) ) {
			return $user;
		}

		if ( get_current_user_id() === $user->ID ) {
			return true;
		}

		if ( 'edit' === $request['context'] && ! current_user_can( 'list_users' ) ) {
			return new \WP_Error(
				'rest_user_cannot_view',
				__( 'Sorry, you are not allowed to list users.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		if ( ! $this->user_posts_count_public( $user->ID, $this->story_post_type->get_slug() ) && ! current_user_can( 'edit_user', $user->ID ) && ! current_user_can( 'list_users' ) ) {
			return new \WP_Error(
				'rest_user_cannot_view',
				__( 'Sorry, you are not allowed to list users.', 'web-stories' ),
				[ 'status' => rest_authorization_required_code() ]
			);
		}

		return true;
	}

	/**
	 * Number of posts user has written.
	 *
	 * Wraps {@see count_user_posts()} results in a cache.
	 *
	 * @SuppressWarnings(PHPMD.BooleanArgumentFlag)
	 *
	 * @since 1.10.0
	 *
	 * @link https://core.trac.wordpress.org/ticket/39242
	 *
	 * @param int    $userid      User ID.
	 * @param string $post_type   Optional. Single post type or array of post types to count the number of posts for. Default 'post'.
	 * @return int Number of posts the user has written in this post type.
	 */
	protected function user_posts_count_public( int $userid, string $post_type = 'post' ): int {
		$cache_key   = "count_user_{$post_type}_{$userid}";
		$cache_group = 'user_posts_count';

		/**
		 * Post count.
		 *
		 * @var string|false $count
		 */
		$count = wp_cache_get( $cache_key, $cache_group );
		if ( false === $count ) {
			// phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.count_user_posts_count_user_posts
			$count = count_user_posts( $userid, $post_type, true );
			wp_cache_add( $cache_key, $count, $cache_group );
		}

		return (int) $count;
	}
}
