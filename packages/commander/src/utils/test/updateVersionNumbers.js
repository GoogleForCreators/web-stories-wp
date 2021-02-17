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
import updateVersionNumbers from '../updateVersionNumbers';

jest.mock('fs');
jest.mock('../appendRevisionToVersion', () =>
  jest.fn(() => '1.0.0-alpha+1234567')
);

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

 define( 'WEBSTORIES_VERSION', '1.0.0-alpha' );
`;

describe('updateVersionNumbers', () => {
  const MOCK_FILE_INFO = {
    '/foo/plugin.php': PLUGIN_FILE_CONTENT,
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  it('should use provided version number', () => {
    updateVersionNumbers('/foo/plugin.php', '7.8.9');
    const pluginFile = readFileSync('/foo/plugin.php');

    expect(pluginFile).toContain('* Version: 7.8.9');
    expect(pluginFile).toContain(`define( 'WEBSTORIES_VERSION', '7.8.9' );`);
  });

  it('should update plugin header for pre-release', () => {
    updateVersionNumbers('/foo/plugin.php', '7.8.9-alpha');
    const pluginFile = readFileSync('/foo/plugin.php');

    expect(pluginFile).toContain('* Version: 7.8.9-alpha');
    expect(pluginFile).toContain(
      `define( 'WEBSTORIES_VERSION', '7.8.9-alpha' );`
    );
  });

  it('should not update plugin header for nightly build', () => {
    updateVersionNumbers('/foo/plugin.php', '1.0.0-alpha', true);
    const pluginFile = readFileSync('/foo/plugin.php');

    expect(pluginFile).toContain('* Version: 1.0.0');
    expect(pluginFile).not.toContain('* Version: 7.8.9-alpha');
    expect(pluginFile).toContain(
      `define( 'WEBSTORIES_VERSION', '1.0.0-alpha+1234567' );`
    );
  });
});
