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
 * Internal dependencies
 */
import appendRevisionToVersion from '../appendRevisionToVersion';

jest.mock('child_process', () => {
  return {
    execSync: () => '1234567',
  };
});

describe('appendRevisionToVersion', () => {
  it('should get the current git commit hash', () => {
    const orig = process.env.GITHUB_SHA;
    delete process.env.GITHUB_SHA;
    const result = appendRevisionToVersion('1.2.3');
    expect(result).toStrictEqual('1.2.3+1234567');
    process.env.GITHUB_SHA = orig;
  });

  it('should use the provided git commit hash', () => {
    process.env.GITHUB_SHA = 'abc1234';
    const result = appendRevisionToVersion('1.2.3');
    expect(result).toStrictEqual('1.2.3+abc1234');
    delete process.env.GITHUB_SHA;
  });
});
