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
import removeDevCode from '../removeDevCode';

jest.mock('fs');

describe('removeDevCode', () => {
  const MOCK_FILE_INFO = {
    '/foo.php': `
      <?php
      // ...
      $foo = 'bar';

      // WEB-STORIES-DEV-CODE.
      // This block of code is removed during the build process.
      $bar = 'baz';
      // WEB-STORIES-DEV-CODE.

      // ...
      $baz = 'foo';
    `,
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  it('removes everything between dev code markers', () => {
    removeDevCode('/foo.php');
    const fileContent = readFileSync('/foo.php');
    expect(fileContent).toStrictEqual(
      `
      <?php
      // ...
      $foo = 'bar';

      // ...
      $baz = 'foo';
    `
    );
  });
});
