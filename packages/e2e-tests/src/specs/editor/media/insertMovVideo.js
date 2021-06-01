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
  createNewStory,
  uploadFile,
  deleteMedia,
  withExperimentalFeatures,
} from '@web-stories-wp/e2e-test-utils';

const MODAL = '.media-modal';

describe('Inserting .mov from dialog', () => {
  withExperimentalFeatures(['enableMediaPickerVideoOptimization']);
  // Uses the existence of the element's frame element as an indicator for successful insertion.
  it('should not list the .mov', async () => {
    await createNewStory();
    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');

    await expect(page).toClick('button', { text: 'Upload' });

    await page.waitForSelector(MODAL, {
      visible: true,
    });
    const fileName = await uploadFile('small-video.mov', false);
    const fileNameNoExt = fileName.replace(/\.[^/.]+$/, '');

    await expect(page).toClick('button', { text: 'Insert into page' });

    await page.waitForSelector('[data-testid="videoElement"]');
    await expect(page).toMatchElement('[data-testid="videoElement"]');

    await deleteMedia(fileNameNoExt);
  });
});
