/*
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

/**
 * External dependencies
 */
import { __setMockFiles, readFileSync } from 'fs';

/**
 * Internal dependencies
 */
import updateCdnUrl from '../updateCdnUrl';

jest.mock('fs');

const PLUGIN_FILE_CONTENT = `
<?php
/**
 * Main plugin file.

 * Plugin Name: Web Stories
 * Description: Visual storytelling for WordPress.
 * Plugin URI: https://github.com/google/web-stories-wp
 * Author: Google
 * Author URI: https://opensource.google.com/
 * Version: 1.0.0-alpha
 * Requires at least: 5.3
 * Requires PHP: 5.6
 * Text Domain: web-stories
 * Domain Path: /languages/
 * License: Apache License 2.0
 * License URI: https://www.apache.org/licenses/LICENSE-2.0
 */

 define( 'WEBSTORIES_CDN_URL', 'https://wp.stories.google/static/main' );
`;

describe('updateCdnUrl', () => {
  const MOCK_FILE_INFO = {
    '/foo/plugin.php': PLUGIN_FILE_CONTENT,
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  it('should update CDN  URL', () => {
    updateCdnUrl('/foo/plugin.php', '7.8.9');
    const pluginFile = readFileSync('/foo/plugin.php');

    expect(pluginFile).toContain(
      `define( 'WEBSTORIES_CDN_URL', 'https://wp.stories.google/static/7.8.9' );`
    );
  });
});
