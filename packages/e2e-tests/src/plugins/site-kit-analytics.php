<?php
/**
 * Plugin Name: E2E Tests Site kit Analytics mock
 * Plugin URI:  https://github.com/googleforcreators/web-stories-wp
 * Description: Utility plugin to mock sitekit analytics
 * Author:      Google
 * Author URI:  https://opensource.google.com
 */

namespace Google\Web_Stories\E2E\Sitekit\Analytics;

define( 'GOOGLESITEKIT_VERSION', '1.0.0' );

/**
 * Mock output for plugin.
 *
 * @return void
 */
function print_amp_gtag() {
	$property_id  = 'XXX-YYY';
	$gtag_amp_opt = [
		'vars'            => [
			'gtag_id' => $property_id,
			'config'  => [
				$property_id => [
					'groups' => 'default',
					'linker' => [
						'domains' => [ home_url() ],
					],
				],
			],
		],
		'optoutElementId' => '__gaOptOutExtension',
	];

	/**
	 * Filters the gtag configuration options for the amp-analytics tag.
	 *
	 * You can use the {@see 'googlesitekit_gtag_opt'} filter to do the same for gtag in non-AMP.
	 *
	 * @since 1.0.0
	 *
	 * @param array $gtag_amp_opt gtag config options for AMP.
	 *
	 * @see   https://developers.google.com/gtagjs/devguide/amp
	 *
	 */
	$gtag_amp_opt_filtered = apply_filters( 'googlesitekit_amp_gtag_opt', $gtag_amp_opt );

	// Ensure gtag_id is set to the correct value.
	if ( ! is_array( $gtag_amp_opt_filtered ) ) {
		$gtag_amp_opt_filtered = $gtag_amp_opt;
	}

	if ( ! isset( $gtag_amp_opt_filtered['vars'] ) || ! is_array( $gtag_amp_opt_filtered['vars'] ) ) {
		$gtag_amp_opt_filtered['vars'] = $gtag_amp_opt['vars'];
	}

	$gtag_amp_opt_filtered['vars']['gtag_id'] = $property_id;

	printf(
		'<amp-analytics type="gtag" data-credentials="include"%s><script type="application/json">%s</script></amp-analytics>',
		get_tag_amp_block_on_consent_attribute(), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		wp_json_encode( $gtag_amp_opt_filtered )
	);
}

add_action( 'web_stories_print_analytics', __NAMESPACE__ . '\print_amp_gtag' );

/**
 * Force analytics to be enabled.
 *
 * @param $current
 *
 * @return string[]
 */
function mock_enable_active_modules( $current ) {
	return [ 'analytics' ];
}
add_filter( 'pre_option_googlesitekit_active_modules', __NAMESPACE__ . '\mock_enable_active_modules' );


/**
 * Force analytics snippet to be enabled.
 *
 * @param $current
 *
 * @return string[]
 */
function mock_enable_analytics_settings( $current ) {
	return [ 'useSnippet' => true ];
}
add_filter( 'pre_option_googlesitekit_analytics_settings', __NAMESPACE__ . '\mock_enable_analytics_settings' );

/**
 * Gets the HTML attributes for an AMP tag that may potentially require user consent before loading.
 *
 *
 * @return string HTML attributes to add if the tag requires consent to load, or an empty string.
 */
function get_tag_amp_block_on_consent_attribute() {
	/**
	 * Filters whether the tag requires user consent before loading.
	 *
	 * @since 1.18.0
	 *
	 * @param bool|string $blocked Whether or not the tag requires user consent to load. Alternatively, this can also be one of
	 *                             the special string values '_till_responded', '_till_accepted', or '_auto_reject'. Default: false.
	 */
	$block_on_consent = apply_filters( 'googlesitekit_analytics_tag_amp_block_on_consent', false );

	if ( in_array( $block_on_consent, get_allowed_amp_block_on_consent_values(), true ) ) {
		return sprintf( ' data-block-on-consent="%s"', $block_on_consent );
	}

	if ( filter_var( $block_on_consent, FILTER_VALIDATE_BOOLEAN ) ) {
		return ' data-block-on-consent';
	}

	return '';
}


function get_allowed_amp_block_on_consent_values() {
	return [
		'_till_responded',
		'_till_accepted',
		'_auto_reject',
	];
}
