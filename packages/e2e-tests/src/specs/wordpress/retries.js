/*
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
/**
 * External dependencies
 */
import { join } from 'path';
import { tmpdir } from 'os';
import { readFileSync, writeFileSync } from 'fs';

describe('Retries', () => {
  const countPath = join(tmpdir(), 'test.txt');
  beforeAll(() => {
    writeFileSync(countPath, '0', 'utf8');
  });
  it('retries', () => {
    const tries = Number(readFileSync(countPath, 'utf8'));
    writeFileSync(countPath, String(tries + 1), 'utf8');
    expect(tries).toBeGreaterThanOrEqual(3);
  });
});
