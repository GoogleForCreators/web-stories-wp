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
import { createSolidFromString } from '@googleforcreators/patterns';
import { createPage, registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import isEmptyStory from '../isEmptyStory';

describe('isEmptyStory', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  it('should count newly created story as empty', () => {
    const newlyCreatedStoryPages = [createPage()];
    expect(isEmptyStory(newlyCreatedStoryPages)).toBeTrue();
  });

  it('should not count story with changed background color as empty', () => {
    const storyWithChangedBackgroundColor = [createPage()];
    storyWithChangedBackgroundColor[0].backgroundColor =
      createSolidFromString('#ff0000');
    expect(isEmptyStory(storyWithChangedBackgroundColor)).toBeFalse();
  });

  it('should not count story with changed background media as empty', () => {
    const storyWithBackgroundMedia = [createPage()];
    storyWithBackgroundMedia[0].elements[0].isDefaultBackground = false;
    expect(isEmptyStory(storyWithBackgroundMedia)).toBeFalse();
  });

  it('should not count story with 2 pages as empty', () => {
    const storyWith2Pages = [createPage(), createPage()];
    expect(isEmptyStory(storyWith2Pages)).toBeFalse();
  });

  it('should not count story with extra elements as empty', () => {
    const storyWithExtraElements = [createPage()];
    storyWithExtraElements[0].elements.push({});
    expect(isEmptyStory(storyWithExtraElements)).toBeFalse();
  });

  it('should not count story with an attachment as empty', () => {
    const storyWithAttachment = [createPage()];
    const testUrl = 'https://testurl.com';
    const pageAttachmentObject = { url: testUrl };

    storyWithAttachment[0].pageAttachment = pageAttachmentObject;
    expect(isEmptyStory(storyWithAttachment)).toBeFalse();
  });

  it('should count story without the pageAttachment property as empty', () => {
    const storyWithoutAttachment = [createPage()];

    expect(isEmptyStory(storyWithoutAttachment)).toBeTrue();
  });

  it('should count story without the pageAttachment property set to null as empty', () => {
    const storyWithoutAttachment = [createPage()];
    const pageAttachmentObject = null;

    storyWithoutAttachment[0].pageAttachment = pageAttachmentObject;
    expect(isEmptyStory(storyWithoutAttachment)).toBeTrue();
  });

  it('should count story that has the pageAttachment property with an empty url string as empty', () => {
    const storyWithoutAttachment = [createPage()];
    const testUrl = '';
    const pageAttachmentObject = { url: testUrl };

    storyWithoutAttachment[0].pageAttachment = pageAttachmentObject;
    expect(isEmptyStory(storyWithoutAttachment)).toBeTrue();
  });
});
