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
import { spawnSync } from 'child_process';
import glob from 'glob';
import chalk from 'chalk';

/* eslint-disable no-console */
/* eslint-disable no-process-exit */

const options = { nocase: true };
const files = glob.sync('**/*.karma.js', options);

const retries = 5;
const filesPerBatch = 5;
const totalBatches = Math.ceil(files.length / filesPerBatch);
let batch = 1;
for (let i = 0; i < files.length; i += filesPerBatch) {
  const shard = `${batch}/${totalBatches}`;
  console.log(chalk.white(`🧪 Testing batch ${shard}`));
  for (let retry = 0; retry < retries; retry++) {
    const result = spawnSync(
      'npm',
      `run test:karma:story-editor -- --viewport=1600:1000 --headless --shard=${shard}`.split(
        ' '
      ),
      { cwd: '.', encoding: 'utf-8' }
      //, stdio: "inherit" to print output in real-time
    );
    if (result.status === 0) {
      //   console.log(result.stdout);
      //   console.log(result.stderr);
      console.log(chalk.green(`✅ Batch ${shard} passed`));
      batch++;
      break;
    } else {
      console.log(result.stdout);
      console.log(result.stderr);
      console.log(
        chalk.blueBright(`❄️  Possible flaky test? Try again ${shard}`)
      );
    }
    if (result.status !== 0 && retry === retries) {
      console.log(result.stdout);
      console.log(result.stderr);
      console.log(chalk.red('❌ Not a flaky test!?'));
      process.exit(1);
    }
  }
  console.log();
}

console.log(chalk.green('All tests passed 🏅'));

/* eslint-enable no-console */
/* eslint-enable no-process-exit */
