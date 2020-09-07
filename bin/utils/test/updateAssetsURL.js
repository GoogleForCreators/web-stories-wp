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
import updateAssetsURL from '../updateAssetsURL';

jest.mock('fs');

describe('updateAssetsURL', () => {
  const MOCK_FILE_INFO = {
    '/foo/plugin.php': `
      <?php
      // ...
      define( 'WEBSTORIES_VERSION', '1.0.0-alpha' );
      define( 'WEBSTORIES_PLUGIN_FILE', __FILE__ );
      define( 'WEBSTORIES_PLUGIN_DIR_PATH', plugin_dir_path( WEBSTORIES_PLUGIN_FILE ) );
      define( 'WEBSTORIES_PLUGIN_DIR_URL', plugin_dir_url( WEBSTORIES_PLUGIN_FILE ) );
      define( 'WEBSTORIES_ASSETS_URL', WEBSTORIES_PLUGIN_DIR_URL . '/assets' );
    `,
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  it('replaces assets URL constant with CDN URL', () => {
    updateAssetsURL('/foo/plugin.php', 'https://cdn.example.com/');
    const fileContent = readFileSync('/foo/plugin.php');
    expect(fileContent).toContain(
      `define( 'WEBSTORIES_ASSETS_URL', 'https://cdn.example.com/' );`
    );
  });
});
