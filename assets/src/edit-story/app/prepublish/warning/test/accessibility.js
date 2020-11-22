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
import { MESSAGES } from '../../constants';
import * as accessibilityChecks from '../accessibility';

describe('Pre-publish checklist - accessibility issues (warnings)', () => {
  describe('textElementFontLowContrast', () => {
    it('should return a warning if text element is low contrast', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 19,
        backgroundTextMode: 'FILL',
        backgroundColor: {
          color: {
            r: 200,
            g: 200,
            b: 200,
          },
        },
        content: '<span style="color: #fff">HOT GOSSIP ARTICLE</span>',
      };
      expect(
        accessibilityChecks.textElementFontLowContrast(element)
      ).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.LOW_CONTRAST.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.LOW_CONTRAST.HELPER_TEXT,
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return undefined if text element is high enough contrast', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 19,
        backgroundTextMode: 'FILL',
        backgroundColor: {
          color: {
            r: 255,
            g: 255,
            b: 255,
          },
        },
        content: '<span style="color: #000">HOT GOSSIP ARTICLE</span>',
      };
      expect(
        accessibilityChecks.textElementFontLowContrast(element)
      ).toBeUndefined();
    });

    it('should return undefined if content has no spans', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 19,
        backgroundTextMode: 'FILL',
        backgroundColor: {
          color: {
            r: 255,
            g: 0,
            b: 153,
          },
        },
        content: 'HOT GOSSIP ARTICLE',
      };
      expect(
        accessibilityChecks.textElementFontLowContrast(element)
      ).toBeUndefined();
    });

    it('should return undefined if element has no background fill', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 19,
        backgroundTextMode: 'NONE',
        content: '<span style="color: #fff">HOT GOSSIP ARTICLE</span>',
      };
      expect(
        accessibilityChecks.textElementFontLowContrast(element)
      ).toBeUndefined();
    });
  });

  describe('textElementFontSizeTooSmall', () => {
    it('should return a warning if text element font size is too small', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 11,
      };
      expect(
        accessibilityChecks.textElementFontSizeTooSmall(element)
      ).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.FONT_TOO_SMALL.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.FONT_TOO_SMALL.HELPER_TEXT,
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return undefined if text element font size is large enough', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        fontSize: 12,
      };
      expect(
        accessibilityChecks.textElementFontSizeTooSmall(element)
      ).toBeUndefined();
    });
  });

  describe('imageElementLowResolution', () => {
    it('should return a warning if image element is low pixel density', () => {
      const element = {
        id: 'elementid',
        type: 'image',
        width: 100,
        height: 100,
        scale: 100,
        resource: {
          type: 'image',
          width: 99,
          height: 99,
        },
      };
      expect(
        accessibilityChecks.imageElementLowResolution(element)
      ).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.LOW_IMAGE_RESOLUTION.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.LOW_IMAGE_RESOLUTION.HELPER_TEXT,
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return a warning if image element is low pixel density adjusted with scale', () => {
      const element = {
        id: 'elementid',
        type: 'image',
        width: 100,
        height: 100,
        scale: 130,
        resource: {
          type: 'image',
          width: 100,
          height: 100,
        },
      };
      expect(
        accessibilityChecks.imageElementLowResolution(element)
      ).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.LOW_IMAGE_RESOLUTION.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.LOW_IMAGE_RESOLUTION.HELPER_TEXT,
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return undefined if image element has high enough pixel density', () => {
      const element = {
        id: 'elementid',
        type: 'image',
        width: 100,
        height: 100,
        scale: 100,
        resource: {
          type: 'image',
          width: 100,
          height: 100,
        },
      };
      expect(
        accessibilityChecks.imageElementLowResolution(element)
      ).toBeUndefined();
    });
  });

  describe('videoElementMissingTitle', () => {
    it('should return a warning if video element missing title', () => {
      const element = {
        id: 'elementid',
        type: 'video',
        resource: {},
      };
      expect(
        accessibilityChecks.videoElementMissingTitle(element)
      ).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_TITLE.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_TITLE.HELPER_TEXT,
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return a warning if video element has empty title', () => {
      const element = {
        id: 'elementid',
        type: 'video',
        title: '',
        resource: {
          title: '',
        },
      };
      expect(
        accessibilityChecks.videoElementMissingTitle(element)
      ).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_TITLE.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_TITLE.HELPER_TEXT,
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return undefined if video element has title', () => {
      const element = {
        id: 'elementid',
        type: 'video',
        title: 'Video title',
        resource: {},
      };
      expect(
        accessibilityChecks.videoElementMissingTitle(element)
      ).toBeUndefined();
    });

    it('should return undefined if video resource has title', () => {
      const element = {
        id: 'elementid',
        type: 'video',
        resource: {
          title: 'Video title',
        },
      };
      expect(
        accessibilityChecks.videoElementMissingTitle(element)
      ).toBeUndefined();
    });
  });

  describe('videoElementMissingAlt', () => {
    it('should return a warning if video element missing alt', () => {
      const element = {
        id: 'elementid',
        type: 'video',
        resource: {},
      };
      expect(accessibilityChecks.videoElementMissingAlt(element)).toStrictEqual(
        {
          message: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_ALT_TEXT.MAIN_TEXT,
          help: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_ALT_TEXT.HELPER_TEXT,
          elementId: element.id,
          type: 'warning',
        }
      );
    });

    it('should return a warning if video element has empty alt', () => {
      const element = {
        id: 'elementid',
        type: 'video',
        alt: '',
        resource: {
          alt: '',
        },
      };
      expect(accessibilityChecks.videoElementMissingAlt(element)).toStrictEqual(
        {
          message: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_ALT_TEXT.MAIN_TEXT,
          help: MESSAGES.ACCESSIBILITY.MISSING_VIDEO_ALT_TEXT.HELPER_TEXT,
          elementId: element.id,
          type: 'warning',
        }
      );
    });

    it('should return undefined if video element has alt', () => {
      const element = {
        id: 'elementid',
        type: 'video',
        alt: 'Video is about things',
        resource: {},
      };
      expect(
        accessibilityChecks.videoElementMissingAlt(element)
      ).toBeUndefined();
    });

    it('should return undefined if video resource has alt', () => {
      const element = {
        id: 'elementid',
        type: 'image',
        resource: {
          alt: 'Image is about things',
        },
      };
      expect(
        accessibilityChecks.videoElementMissingAlt(element)
      ).toBeUndefined();
    });
  });

  describe('videoElementMissingCaptions', () => {
    it('should return a warning if video element missing captions', () => {
      const element = {
        id: 'elementid',
        type: 'video',
      };
      expect(
        accessibilityChecks.videoElementMissingCaptions(element)
      ).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.MISSING_CAPTIONS.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.MISSING_CAPTIONS.HELPER_TEXT,
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return a warning if video element has empty captions', () => {
      const element = {
        id: 'elementid',
        type: 'video',
        tracks: [],
      };
      expect(
        accessibilityChecks.videoElementMissingCaptions(element)
      ).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.MISSING_CAPTIONS.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.MISSING_CAPTIONS.HELPER_TEXT,
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return undefined if video element has captions', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        tracks: [{ id: 'trackid' }],
      };
      expect(
        accessibilityChecks.videoElementMissingCaptions(element)
      ).toBeUndefined();
    });
  });

  describe('pageTooManyLinks', () => {
    it('should return a warning if page has too many links', () => {
      const page = {
        id: 'pageid',
        elements: [
          { type: 'text' },
          { type: 'video' },
          {
            type: 'text',
            link: {
              url: 'https://google.com',
            },
          },
          {
            type: 'image',
            link: {
              url: 'https://google.com',
            },
          },
          {
            type: 'text',
            link: {
              url: '',
            },
          },
          {
            type: 'text',
            link: {
              url: 'https://google.com',
            },
          },
          {
            type: 'text',
            link: {
              url: 'https://google.com',
            },
          },
        ],
      };
      expect(accessibilityChecks.pageTooManyLinks(page)).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.TOO_MANY_LINKS.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.TOO_MANY_LINKS.HELPER_TEXT,
        pageId: page.id,
        type: 'warning',
      });
    });

    it('should return undefined if page has a reasonable number of links', () => {
      const page = {
        elements: [
          { type: 'text' },
          { type: 'video' },
          {
            type: 'text',
            link: {
              url: 'https://google.com',
            },
          },
          {
            type: 'image',
            link: {
              url: 'https://google.com',
            },
          },
          {
            type: 'text',
            link: {
              url: '',
            },
          },
          {
            type: 'text',
            link: {
              url: 'https://google.com',
            },
          },
        ],
      };
      expect(accessibilityChecks.pageTooManyLinks(page)).toBeUndefined();
    });
  });

  describe('elementLinkTappableRegionTooSmall', () => {
    it('should return a warning if element tappable region is too small', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        link: {
          url: 'https://google.com',
        },
        content: 'G',
        width: 40,
        height: 40,
      };
      expect(
        accessibilityChecks.elementLinkTappableRegionTooSmall(element)
      ).toStrictEqual({
        message: MESSAGES.ACCESSIBILITY.LINK_REGION_TOO_SMALL.MAIN_TEXT,
        help: MESSAGES.ACCESSIBILITY.LINK_REGION_TOO_SMALL.HELPER_TEXT,
        elementId: element.id,
        type: 'warning',
      });
    });

    it('should return undefined if element has large enough tappable region', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        link: {
          url: 'https://google.com',
        },
        content: 'G',
        width: 48,
        height: 48,
      };
      expect(
        accessibilityChecks.elementLinkTappableRegionTooSmall(element)
      ).toBeUndefined();
    });

    it('should return undefined if not an element with link', () => {
      const element = {
        id: 'elementid',
        type: 'text',
        content: 'G',
        width: 40,
        height: 40,
      };
      expect(
        accessibilityChecks.elementLinkTappableRegionTooSmall(element)
      ).toBeUndefined();
    });
  });

  describe('imageElementMissingAlt', () => {
    it('should return a warning if image element missing alt', () => {
      const element = {
        id: 'elementid',
        type: 'image',
        resource: {},
      };
      expect(accessibilityChecks.imageElementMissingAlt(element)).toStrictEqual(
        {
          message: MESSAGES.ACCESSIBILITY.MISSING_IMAGE_ALT_TEXT.MAIN_TEXT,
          help: MESSAGES.ACCESSIBILITY.MISSING_IMAGE_ALT_TEXT.HELPER_TEXT,
          elementId: element.id,
          type: 'warning',
        }
      );
    });

    it('should return a warning if image element has empty alt', () => {
      const element = {
        id: 'elementid',
        type: 'image',
        alt: '',
        resource: {
          alt: '',
        },
      };
      expect(accessibilityChecks.imageElementMissingAlt(element)).toStrictEqual(
        {
          message: MESSAGES.ACCESSIBILITY.MISSING_IMAGE_ALT_TEXT.MAIN_TEXT,
          help: MESSAGES.ACCESSIBILITY.MISSING_IMAGE_ALT_TEXT.HELPER_TEXT,
          elementId: element.id,
          type: 'warning',
        }
      );
    });

    it('should return undefined if image element has alt', () => {
      const element = {
        id: 'elementid',
        type: 'image',
        alt: 'Image is about things',
        resource: {},
      };
      expect(
        accessibilityChecks.imageElementMissingAlt(element)
      ).toBeUndefined();
    });

    it('should return undefined if image resource has alt', () => {
      const element = {
        id: 'elementid',
        type: 'image',
        resource: {
          alt: 'Image is about things',
        },
      };
      expect(
        accessibilityChecks.imageElementMissingAlt(element)
      ).toBeUndefined();
    });
  });
});
