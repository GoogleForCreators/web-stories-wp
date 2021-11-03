<?php

namespace Google\Web_Stories\Media;

use Google\Web_Stories\Service_Base;
use Google\Web_Stories\Infrastructure\HasMeta;

/**
 *
 */
class Base_Color extends Service_Base implements HasMeta {

	/**
	 * The base color meta key.
	 *
	 * @var string
	 */
	const BASE_COLOR_POST_META_KEY = 'web_stories_base_color';

	/**
	 * Init.
	 *
	 * @since 1.10.0
	 *
	 * @return void
	 */
	public function register() {
		$this->register_meta();
	}

	/**
	 * Register meta
	 *
	 * @since 1.15.0
	 *
	 * @return void
	 */
	public function register_meta() {
		register_meta(
			'post',
			self::BASE_COLOR_POST_META_KEY,
			[
				'type'              => 'string',
				'description'       => __( 'Attachment base color', 'web-stories' ),
				'show_in_rest'      => true,
				'default'           => '',
				'single'            => true,
				'object_subtype'    => 'attachment',
			]
		);

		add_filter( 'wp_prepare_attachment_for_js', [ $this, 'wp_prepare_attachment_for_js' ] );
	}

	/**
	 * Filters the attachment data prepared for JavaScript.
	 *
	 * @since 1.15.0
	 *
	 * @param array|mixed $response   Array of prepared attachment data.
	 *
	 * @return array|mixed $response;
	 */
	public function wp_prepare_attachment_for_js( $response ) {
		if ( ! is_array( $response ) ) {
			return $response;
		}

		$response[ self::BASE_COLOR_POST_META_KEY ] = get_post_meta( $response['id'], self::BASE_COLOR_POST_META_KEY, true );

		return $response;
	}
}
