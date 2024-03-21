/*
 * Copyright 2023 Google LLC
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

// eslint-disable-next-line import/no-extraneous-dependencies -- Installed in main package.json.
import 'jest-extended';
// eslint-disable-next-line import/no-extraneous-dependencies -- Installed in main package.json.
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidAMP(): Promise<R>;
      toBeValidAMPStory(): Promise<R>;
      toBeValidAMPStoryPage(): Promise<R>;
      toBeValidAMPStoryElement(): Promise<R>;
    }
  }
}

export {};
