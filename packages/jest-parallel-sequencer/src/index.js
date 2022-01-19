/*
 * Copyright 2022 Google LLC
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
import TestSequencer from '@jest/test-sequencer';

let totalShards = 1;
let shardNumber = 1;
if (process.env.SHARD) {
  [shardNumber, totalShards] = process.env.SHARD.split('/');
}
const shardIndex = shardNumber - 1;

// https://jestjs.io/docs/configuration#testsequencer-string
// https://github.com/facebook/jest/issues/11252
class ParallelSequencer extends TestSequencer.default {
  /**
   * Select test files that should run based on the sharding config.
   *
   * @param {import('jest-runner').Test[]} tests List of all tests.
   * @return {import('jest-runner').Test[]} Shorter list of tests to actually run.
   */
  sort(tests) {
    const chunkSize = Math.ceil(tests.length / totalShards);
    const minIndex = shardIndex * chunkSize;
    const maxIndex = minIndex + chunkSize;

    return Array.from(tests)
      .sort((testA, testB) => (testA.path > testB.path ? 1 : -1))
      .slice(minIndex, maxIndex);
  }
}

export default ParallelSequencer;
