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
import updateTemplates from '../updateTemplates';

jest.mock('fs');
jest.mock('../../module', () => ({
  migrate: jest.fn(() => ({ migratedkey: 'migratedvalue' })),
  DATA_VERSION: 9999,
}));

const TEMPLATE_1_CONTENT = JSON.stringify({
  version: 1,
  foo: 'bar',
  baz: 'foobar',
});

const TEMPLATE_2_CONTENT = JSON.stringify({
  version: 9999,
  foo: 'bar',
  baz: 'foobar',
});

describe('updateTemplates', () => {
  const MOCK_FILE_INFO = {
    '/foo/template1.json': TEMPLATE_1_CONTENT,
    '/foo/template2.json': TEMPLATE_2_CONTENT,
  };

  beforeEach(() => {
    __setMockFiles(MOCK_FILE_INFO);
  });

  it('should use provided version number', () => {
    updateTemplates('/foo');
    const template1 = readFileSync('/foo/template1.json');
    const template2 = readFileSync('/foo/template2.json');

    expect(template1).toStrictEqual(
      JSON.stringify({
        version: 9999,
        migratedkey: 'migratedvalue',
      })
    );
    expect(template2).toStrictEqual(TEMPLATE_2_CONTENT);
  });
});
