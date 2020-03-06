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
import PageOutput from '../page';

describe('Page output', () => {
  it('should produce valid AMP output', async () => {
    const props = {
      id: '123',
      backgroundColor: '#fff000',
      page: {
        id: '123',
        elements: [],
      },
    };

    await expect(<PageOutput {...props} />).toBeValidAMPStoryPage();
  });
});
