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
import path from 'path';
import os from 'os';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

async function fileUpload(selector, file, ext) {
  await page.waitForSelector(selector);
  const inputElement = await page.$(selector);
  const testFilePath = path.join(
    // eslint-disable-next-line no-undef
    __dirname,
    '..',
    'assets',
    file + '.' + ext
  );
  const filename = uuid();
  const tmpFileName = path.join(os.tmpdir(), filename + '.' + ext);
  fs.copyFileSync(testFilePath, tmpFileName);
  await inputElement.uploadFile(tmpFileName);
  return filename;
}

export default fileUpload;
