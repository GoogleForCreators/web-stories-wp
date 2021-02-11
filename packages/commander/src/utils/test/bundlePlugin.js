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
import bundlePlugin from '../bundlePlugin';
import generateZipFile from '../generateZipFile';
import getCurrentVersionNumber from '../getCurrentVersionNumber';
import deleteExistingZipFiles from '../deleteExistingZipFiles';

jest.mock('fs');
jest.mock('child_process');

jest.mock('../generateZipFile');
jest.mock('../getCurrentVersionNumber');
jest.mock('../deleteExistingZipFiles');

getCurrentVersionNumber.mockImplementation(() => 'foobar');

describe('bundlePlugin', () => {
  const MOCK_FILE_INFO = {
    '/foo/web-stories/plugin.php': '',
    '/foo/web-stories/readme.txt': '',
    '/foo/web-stories/.distignore': 'example.txt',
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create ZIP file with automatically determined file name', () => {
    const result = bundlePlugin('/foo/web-stories', false, true);
    expect(result).toStrictEqual('/foo/web-stories-foobar.zip');
    expect(generateZipFile).toHaveBeenCalledWith(
      '/foo/web-stories',
      'web-stories-foobar.zip'
    );
  });

  it('should create ZIP file with automatically determined file name for composer build', () => {
    const result = bundlePlugin('/foo/web-stories', true, true);
    expect(result).toStrictEqual('/foo/web-stories-foobar-composer.zip');
    expect(generateZipFile).toHaveBeenCalledWith(
      '/foo/web-stories',
      'web-stories-foobar-composer.zip'
    );
  });

  it('should create ZIP file with custom file name', () => {
    const result = bundlePlugin('/foo/web-stories', false, 'my-plugin.zip');
    expect(result).toStrictEqual('/foo/my-plugin.zip');
    expect(generateZipFile).toHaveBeenCalledWith(
      '/foo/web-stories',
      'my-plugin.zip'
    );
    expect(deleteExistingZipFiles).toHaveBeenCalledTimes(0);
  });

  it('should delete existing ZIP files if asked', () => {
    bundlePlugin('/foo', false, true, true);
    expect(deleteExistingZipFiles).toHaveBeenCalledTimes(1);
  });
});
