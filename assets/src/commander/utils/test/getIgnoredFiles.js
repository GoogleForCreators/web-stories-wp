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
import getIgnoredFiles from '../getIgnoredFiles';

jest.mock('fs');

describe('getIgnoredFiles', () => {
  const MOCK_FILE_INFO = {
    '/foo/.distignore': `
      example.txt

      # somefile.php
      
      doesnotexist.txt
      
      sub
    `,
    '/foo/example.txt': '',
    '/foo/somefile.php': '',
    '/foo/someotherfile.js': '',
    '/foo/baz/example.txt': '',
    '/foo/sub/folder.txt': '',
    '/bar/example.txt': '',
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  it('should return empty array if there is no .distignore file', () => {
    expect(getIgnoredFiles('/bar')).toStrictEqual([]);
  });

  it('should ignore commented out lines', () => {
    expect(getIgnoredFiles('/foo')).not.toContain('somefile.php');
  });

  it('should ignore non-existent files', () => {
    expect(getIgnoredFiles('/foo')).not.toContain('doesnotexist.txt');
  });

  it('should add trailing slashes to directories', () => {
    expect(getIgnoredFiles('/foo')).toContain('sub/');
  });

  it('should return all ignored files', () => {
    expect(getIgnoredFiles('/foo')).toIncludeSameMembers([
      'example.txt',
      'sub/',
    ]);
  });
});
