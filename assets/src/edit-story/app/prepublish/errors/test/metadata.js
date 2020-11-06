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
import * as metadataGuidelines from '../metadata';

describe('Pre-publish checklist - missing critical metadata (errors)', () => {
  it('should return an error-type guidance message if the story is missing its portrait cover', () => {
    const testStory = {
      storyId: 890,
      title: 'Work work work work work',
      featuredMediaUrl: undefined,
    };
    const testMissingCover = metadataGuidelines.storyCoverAttached(testStory);
    expect(testMissingCover).not.toBeUndefined();
    expect(testMissingCover.message).toMatchInlineSnapshot(
      `"Missing story cover"`
    );
    expect(testMissingCover.storyId).toStrictEqual(testStory.storyId);
  });

  it("should return an error-type guidance message if the story is missing it's title", () => {
    const testEmptyStringStory = {
      storyId: 890,
      status: 'draft',
      title: '',
    };
    const testUndefinedTitleStory = {
      storyId: 890,
      status: 'draft',
    };
    const testUndefined = metadataGuidelines.storyTitle(
      testUndefinedTitleStory
    );
    const testEmptyString = metadataGuidelines.storyTitle(testEmptyStringStory);
    const testHappy = metadataGuidelines.storyTitle({
      title: 'The Allegory of the Cave',
    });
    expect(testHappy).toBeUndefined();
    expect(testEmptyString).not.toBeUndefined();
    expect(testUndefined).not.toBeUndefined();
    expect(testUndefined.message).toMatchInlineSnapshot(
      `"Missing story title"`
    );
    expect(testEmptyString.message).toMatchInlineSnapshot(
      `"Missing story title"`
    );
    expect(testUndefined.storyId).toStrictEqual(
      testUndefinedTitleStory.storyId
    );
    expect(testEmptyString.storyId).toStrictEqual(testEmptyStringStory.storyId);
  });

  it('should return an error-type guidance message if there is a link in the page attachment region', () => {
    const elementInRegion = {
      x: 35,
      y: 400,
      width: 188,
      height: 141,
      rotationAngle: 0,
      link: undefined,
    };
    const testPageAttachment = {
      url: 'http://bomb.com',
    };
    const testNoLink = metadataGuidelines.linkInPageAttachmentRegion({
      pages: [
        {
          pageAttachment: testPageAttachment,
          elements: [elementInRegion],
        },
      ],
    });
    const testNoAttachment = metadataGuidelines.linkInPageAttachmentRegion({
      pages: [
        {
          pageAttachment: undefined,
          elements: [{ ...elementInRegion, link: { url: 'bomb.com' } }],
        },
      ],
    });
    const testLinkInPageAttachmentStory = {
      storyId: 123,
      pages: [
        {
          id: 890,
          pageAttachment: testPageAttachment,
          elements: [{ ...elementInRegion, link: { url: 'bomb.com ' } }],
        },
      ],
    };
    const testLinkInPageAttachment = metadataGuidelines.linkInPageAttachmentRegion(
      testLinkInPageAttachmentStory
    );
    expect(testNoLink).toBeUndefined();
    expect(testNoAttachment).toBeUndefined();
    expect(testLinkInPageAttachment).not.toBeUndefined();
    expect(testLinkInPageAttachment.message).toMatchInlineSnapshot(
      `"Page has a link in the page attachment region"`
    );
    expect(testLinkInPageAttachment.pages).toHaveLength(1);
    expect(testLinkInPageAttachment.pages[0]).toStrictEqual(
      testLinkInPageAttachmentStory.pages[0].id
    );
    expect(testLinkInPageAttachment.storyId).toStrictEqual(
      testLinkInPageAttachmentStory.storyId
    );
  });

  // todo: The story's cover and publisher url are not yet returned by the api. See #5105.
  it("should return an error-type guidance message if the story's portrait cover is too small", () => {
    const testHeightStory = {
      storyId: 123,
      publisherLogo: {
        height: 1,
        width: 96,
      },
    };
    const testWidthStory = {
      storyId: 345,
      publisherLogo: {
        width: 1,
        height: 96,
      },
    };
    const testStory = {
      storyId: 456,
      publisherLogo: { height: 1, width: 1 },
    };
    const testHappy = metadataGuidelines.publisherLogoSize({
      storyId: 345,
      publisherLogo: {
        height: 96,
        width: 96,
      },
    });
    const testHeight = metadataGuidelines.publisherLogoSize(testHeightStory);
    const testWidth = metadataGuidelines.publisherLogoSize(testWidthStory);
    const test = metadataGuidelines.publisherLogoSize(testStory);
    expect(testHappy).toBeUndefined();
    expect(testHeight).not.toBeUndefined();
    expect(testHeight.storyId).toStrictEqual(testHeightStory.storyId);
    expect(testWidth).not.toBeUndefined();
    expect(testWidth.storyId).toStrictEqual(testWidthStory.storyId);
    expect(test).not.toBeUndefined();
    expect(test.message).toMatchInlineSnapshot(
      `"Story's publisher logo image is too small"`
    );
    expect(test.storyId).toStrictEqual(testStory.storyId);
  });

  it("should return an error-type guidance message if the story's publisher logo is too small", () => {
    const testHeightStory = {
      storyId: 123,
      featuredMedia: {
        height: 1,
        width: 640,
      },
    };
    const testWidthStory = {
      storyId: 345,
      featuredMedia: {
        width: 1,
        height: 853,
      },
    };
    const testStory = {
      storyId: 456,
      featuredMedia: { height: 1, width: 1 },
    };
    const testHappy = metadataGuidelines.storyCoverPortraitSize({
      storyId: 345,
      featuredMedia: {
        height: 853,
        width: 640,
      },
    });
    const testHeight = metadataGuidelines.storyCoverPortraitSize(
      testHeightStory
    );
    const testWidth = metadataGuidelines.storyCoverPortraitSize(testWidthStory);
    const test = metadataGuidelines.storyCoverPortraitSize(testStory);
    expect(testHappy).toBeUndefined();
    expect(testHeight).not.toBeUndefined();
    expect(testHeight.storyId).toStrictEqual(testHeightStory.storyId);
    expect(testWidth).not.toBeUndefined();
    expect(testWidth.storyId).toStrictEqual(testWidthStory.storyId);
    expect(test).not.toBeUndefined();
    expect(test.message).toMatchInlineSnapshot(
      `"Story's portrait cover image is too small"`
    );
    expect(test.storyId).toStrictEqual(testStory.storyId);
  });
});
