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
import {
  addTextElement,
  createNewStory,
  previewStory,
  insertStoryTitle,
  setAnalyticsCode,
  withPlugin,
} from '@web-stories-wp/e2e-test-utils';

describe('AMP plugin integration', () => {
  withPlugin('amp');

  it('should be able to directly preview a story without amp-analytics being stripped', async () => {
    await setAnalyticsCode('UA-10876-1');

    await createNewStory();

    await insertStoryTitle('Previewing without Publishing');

    await addTextElement();

    const editorPage = page;
    const previewPage = await previewStory(editorPage);
    previewPage.bringToFront();
    await expect(previewPage).toMatchElement('p', {
      text: 'Fill in some text.',
    });

    await expect(previewPage).toMatchElement('amp-analytics');

    await editorPage.bringToFront();
    await previewPage.close();
    await setAnalyticsCode('');
  });
});
