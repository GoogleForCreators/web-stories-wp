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
import { __setMockFiles } from 'fs';

/**
 * Internal dependencies
 */
import createBuild from '../createBuild';
import copyFiles from '../copyFiles';

jest.mock('fs');

jest.mock('../getIgnoredFiles', () => jest.fn(() => ['bar.txt', 'baz/']));
jest.mock('../copyFiles');

describe('createBuild', () => {
  const MOCK_FILE_INFO = {
    '/foo/plugin.php': '',
    '/foo/readme.txt': '',
    '/foo/.distignore': 'example.txt',
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should copy files to build directory', () => {
    createBuild('/foo', '/foo/build/web-stories');
    expect(copyFiles).toHaveBeenCalledWith('/foo', '/foo/build/web-stories', [
      'bar.txt',
      'baz/',
      'composer.json',
    ]);
  });

  it('should ignore third-party folder for composer builds', () => {
    createBuild('/foo', '/foo/build/web-stories', true);
    expect(copyFiles).toHaveBeenCalledWith('/foo', '/foo/build/web-stories', [
      'bar.txt',
      'baz/',
      'includes/vendor/',
    ]);
  });
});
