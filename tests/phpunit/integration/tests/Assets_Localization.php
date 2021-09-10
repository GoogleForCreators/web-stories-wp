<?php
/**
 * Copyright 2021 Google LLC
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

namespace Google\Web_Stories\Tests\Integration;

/**
 * Class Assets_Localization
 *
 * @coversDefaultClass \Google\Web_Stories\Assets_Localization
 */
class Assets_Localization extends TestCase {
	const DASHBOARD_PATH = 'assets/js/wp-dashboard.js';
	const DASHBOARD_MD5  = '30ee63d9b47081ba146bca85f516567b';

	const DYNAMIC_CHUNK_PATH = 'assets/js/chunk-web-stories-template-152-97d6963561814a6040b0.js';
	const DYNAMIC_CHUNK_MD5  = '7ad07d969660120ddb8ff02d147bfa2f';

	protected $locale_switched = false;

	public function setUp() {
		parent::setUp();

		// Mimics Assets::register_script_asset() to register some scripts for testing.

		// Some preloaded chunk that will be enqueued by WordPress
		// because it is a dependency of the "main" script below.
		wp_register_script(
			'vendors-wp-dashboard-e3c9e07fed91f1f06999',
			plugins_url( 'web-stories' ) . '/assets/js/vendors-wp-dashboard-e3c9e07fed91f1f06999.js',
			[],
			WEBSTORIES_VERSION,
			true
		);

		wp_set_script_translations( 'vendors-wp-dashboard-e3c9e07fed91f1f06999', 'web-stories' );

		// A dynamic import chunk that will not be enqueued directly.
		wp_register_script(
			'chunk-web-stories-template-152-97d6963561814a6040b0',
			plugins_url( 'web-stories' ) . '/assets/js/chunk-web-stories-template-152-97d6963561814a6040b0.js',
			[],
			WEBSTORIES_VERSION,
			true
		);

		wp_set_script_translations( 'chunk-web-stories-template-152-97d6963561814a6040b0', 'web-stories' );

		// The "main" script.
		wp_register_script(
			'wp-dashboard',
			plugins_url( 'web-stories' ) . '/assets/js/wp-dashboard.js',
			[ 'vendors-wp-dashboard-e3c9e07fed91f1f06999' ],
			WEBSTORIES_VERSION,
			true
		);

		wp_set_script_translations( 'wp-dashboard', 'web-stories' );

		// Mimics Assets::register_script_asset() to store all dynamic chunks for later use.
		wp_script_add_data( 'wp-dashboard', 'web-stories-chunks', [ 'chunk-web-stories-template-152-97d6963561814a6040b0' ] );

		add_filter( 'load_script_translation_file', [ $this, 'filter_load_script_translation_file' ], 10, 2 );

		$this->locale_switched = switch_to_locale( 'de_DE' );
	}

	public function tearDown() {
		remove_filter( 'load_script_translation_file', [ $this, 'filter_load_script_translation_file' ] );

		if ( $this->locale_switched ) {
			restore_current_locale();
		}

		parent::tearDown();
	}

	/**
	 * Filters the file path for loading script translations for this test.
	 *
	 * @param string|false $file   Path to the translation file to load. False if there isn't one.
	 * @param string       $handle Name of the script to register a translation domain to.
	 * @return string|false Filtered translation file path.
	 */
	public function filter_load_script_translation_file( $file, $handle ) {
		if ( 'wp-dashboard' === $handle ) {
			return WEB_STORIES_TEST_DATA_DIR . '/languages/web-stories-de_DE-30ee63d9b47081ba146bca85f516567b.json';
		}

		if ( 'chunk-web-stories-template-152-97d6963561814a6040b0.js' ) {
			return WEB_STORIES_TEST_DATA_DIR . '/languages/web-stories-de_DE-7ad07d969660120ddb8ff02d147bfa2f.json';
		}

		return $file;
	}

	public function test_merges_translations_from_dynamic_import_chunks() {
		$actual = load_script_textdomain( 'wp-dashboard', 'web-stories' );
		$this->assertNotFalse( $actual );

		$translations = json_decode( $actual, true );
		$this->assertArrayHasKey( 'locale_data', $translations );
		$this->assertArrayHasKey( 'messages', $translations['locale_data'] );

		// These are the strings from the chunk's translation file.
		// If these are available, it means the merging was successful.
		$this->assertArrayHasKey( 'template keywordClothing', $translations['locale_data']['messages'] );
		$this->assertArrayHasKey( 'colorOrange', $translations['locale_data']['messages'] );
		$this->assertArrayHasKey( 'The elegant serif Fashion template works well for New York Fashion Week highlights, high fashion shopping guides and accessory trends.', $translations['locale_data']['messages'] );
	}
}
