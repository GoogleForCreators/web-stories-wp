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
import { __setMockFiles, readdirSync } from 'fs';

/**
 * Internal dependencies
 */
import deleteExistingZipFiles from '../deleteExistingZipFiles';

jest.mock('fs');

describe('deleteExistingZipFiles', () => {
  const MOCK_FILE_INFO = {
    '/build/web-stories.zip': '',
    '/build/web-stories-1.0.0.zip': '',
    '/build/web-stories-1.0.0+1234567.zip': '',
    '/build/unrelated.zip': '',
    '/build/notazipfile.txt': '',
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  it('should delete all existing ZIP files', () => {
    const filesBefore = readdirSync('/build');
    deleteExistingZipFiles('/build');
    const filesAfter = readdirSync('/build');

    expect(filesBefore).toIncludeAllMembers([
      'web-stories.zip',
      'web-stories-1.0.0.zip',
      'web-stories-1.0.0+1234567.zip',
      'notazipfile.txt',
      'unrelated.zip',
    ]);

    expect(filesAfter).toIncludeAllMembers(['notazipfile.txt']);
  });
});
