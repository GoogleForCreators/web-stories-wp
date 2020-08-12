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
import { PAGE_WIDTH, PAGE_HEIGHT } from '../constants';

export { default as AMPStoryWrapper } from './ampStoryWrapper';
export { fillerDateSettingsObject } from '../dataUtils/dateSettings';
export { default as formattedStoriesArray } from '../dataUtils/formattedStoriesArray';
export { default as formattedTemplatesArray } from '../dataUtils/formattedTemplatesArray';
export { default as formattedUsersObject } from '../dataUtils/formattedUsersObject';
export { default as PlayButton } from './playButton';

export const STORYBOOK_PAGE_SIZE = {
  width: 212,
  height: 318,
  containerHeight: 376.89,
};

export const AMP_STORY_ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;

export const fullCopyTemplate = {
  id: 315,
  status: 'draft',
  title: 'New York',
  modified: '2020-07-20T23:12:21.000Z',
  created: '2020-07-20T23:12:21.000Z',
  pages: [
    {
      elements: [
        {
          opacity: 100,
          flip: { vertical: false, horizontal: false },
          rotationAngle: 0,
          lockAspectRatio: true,
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          x: 1,
          y: 1,
          width: 1,
          height: 1,
          mask: { type: 'rectangle' },
          isBackground: true,
          isDefaultBackground: true,
          type: 'shape',
          id: '07f88a13-e21a-4b24-ad7c-7a0f56d7b8c3',
        },
        {
          opacity: 100,
          flip: { vertical: false, horizontal: false },
          rotationAngle: 0,
          lockAspectRatio: true,
          scale: 100,
          focalX: 50,
          focalY: 50,
          resource: {
            type: 'image',
            mimeType: 'image/png',
            creationDate: '2020-07-06T23:18:02',
            src:
              'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676.png',
            width: 330,
            height: 247,
            posterId: 0,
            id: 153,
            title: 'IMG_8676',
            alt: 'IMG_8676',
            local: false,
            sizes: {
              medium: {
                file: 'IMG_8676-300x225.png',
                width: 300,
                height: 225,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-300x225.png',
              },
              large: {
                file: 'IMG_8676-1024x768.png',
                width: 1024,
                height: 768,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-1024x768.png',
              },
              thumbnail: {
                file: 'IMG_8676-150x150.png',
                width: 150,
                height: 150,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-150x150.png',
              },
              medium_large: {
                file: 'IMG_8676-768x576.png',
                width: 768,
                height: 576,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-768x576.png',
              },
              '1536x1536': {
                file: 'IMG_8676-1536x1152.png',
                width: 1536,
                height: 1152,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-1536x1152.png',
              },
              'post-thumbnail': {
                file: 'IMG_8676-1200x900.png',
                width: 1200,
                height: 900,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-1200x900.png',
              },
              'web-stories-poster-portrait': {
                file: 'IMG_8676-696x928.png',
                width: 696,
                height: 928,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-696x928.png',
              },
              'web-stories-poster-square': {
                file: 'IMG_8676-928x928.png',
                width: 928,
                height: 928,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-928x928.png',
              },
              'web-stories-poster-landscape': {
                file: 'IMG_8676-928x696.png',
                width: 928,
                height: 696,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-928x696.png',
              },
              web_stories_thumbnail: {
                file: 'IMG_8676-150x113.png',
                width: 150,
                height: 113,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-150x113.png',
              },
              full: {
                file: 'IMG_8676.png',
                width: 1936,
                height: 1452,
                mime_type: 'image/png',
                source_url:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676.png',
              },
            },
          },
          type: 'image',
          x: 55,
          y: 144,
          width: 330,
          height: 247,
          mask: {
            type: 'rectangle',
            showInLibrary: true,
            name: 'Rectangle',
            path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
            ratio: 1,
          },
          id: 'c65dd091-49d1-466b-83ff-7cb2bb88dea3',
        },
      ],
      backgroundColor: { color: { r: 255, g: 255, b: 255 } },
      type: 'page',
      id: '3a87c94e-0f6c-4ce3-83bd-6d35c47ff95c',
    },
  ],
  author: 1,
  centerTargetAction: '',
  bottomTargetAction:
    'http://localhost:8899/wp-admin/post.php?action=edit&post=315',
  editStoryLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=315',
  originalStoryData: {
    id: 315,
    date: '2020-07-20T16:12:21',
    date_gmt: '2020-07-20T20:12:21',
    guid: {
      rendered: 'http://localhost:8899/?post_type=web-story&#038;p=315',
      raw: 'http://localhost:8899/?post_type=web-story&#038;p=315',
    },
    modified: '2020-07-20T16:12:21',
    modified_gmt: '2020-07-20T23:12:21',
    password: '',
    slug: '',
    status: 'draft',
    type: 'web-story',
    link: 'http://localhost:8899/?post_type=web-story&p=315',
    title: { raw: 'New York', rendered: 'New York' },
    content: {
      raw:
        '<html amp="" lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1"/><script async="" src="https://cdn.ampproject.org/v0.js"></script><script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script><style amp-boilerplate="">body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate="">body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript><style amp-custom="">\n              amp-story-grid-layer {\n                overflow: visible;\n              }\n\n              .page-fullbleed-area,\n              .page-background-overlay-area {\n                position: absolute;\n                overflow: hidden;\n                width: 100%;\n                left: 0;\n                height: calc(1.1851851851851851 * 100%);\n                top: calc((1 - 1.1851851851851851) * 100% / 2);\n              }\n\n              .page-safe-area {\n                overflow: visible;\n                position: absolute;\n                top: 0;\n                bottom: 0;\n                left: 0;\n                right: 0;\n                width: 100%;\n                height: calc(0.84375 * 100%);\n                margin: auto 0;\n              }\n\n              .mask {\n                position: absolute;\n                overflow: hidden;\n              }\n\n              .fill {\n                position: absolute;\n                top: 0;\n                left: 0;\n                right: 0;\n                bottom: 0;\n                margin: 0;\n              }\n              </style><meta name="web-stories-replace-head-start"/><title>Sample 2</title><link rel="canonical" href="http://localhost:8899/?post_type=web-story&amp;p=307"/><meta name="web-stories-replace-head-end"/></head><body><amp-story standalone="standalone" publisher="Web Stories Dev" publisher-logo-src="http://localhost:8899/wp-content/plugins/web-stories/assets/images/fallback-wordpress-publisher-logo.png" title="Sample 2" poster-portrait-src="http://localhost:8899/wp-content/plugins/web-stories/assets/images/fallback-poster.jpg"><amp-story-page id="3a87c94e-0f6c-4ce3-83bd-6d35c47ff95c" auto-advance-after="7s"><amp-story-grid-layer template="vertical" aspect-ratio="412:618"><div class="page-fullbleed-area" style="background-color:#fff"><div class="page-safe-area"><div style="position:absolute;pointer-events:none;left:0%;top:-9.25926%;width:100%;height:118.51852%;opacity:1"><div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0" class="mask" id="el-07f88a13-e21a-4b24-ad7c-7a0f56d7b8c3"><div class="fill"></div></div></div></div></div></amp-story-grid-layer><amp-story-grid-layer template="vertical" aspect-ratio="412:618"><div class="page-fullbleed-area"><div class="page-safe-area"><div style="position:absolute;pointer-events:none;left:13.34951%;top:23.30097%;width:80.09709%;height:39.96764%;opacity:1"><div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0" class="mask" id="el-c65dd091-49d1-466b-83ff-7cb2bb88dea3"><div style="position:absolute;width:100%;height:100%;left:0%;top:0%"><amp-img layout="fill" src="http://localhost:8899/wp-content/uploads/2020/07/IMG_8676.png" alt="IMG_8676"></amp-img></div></div></div></div></div></amp-story-grid-layer></amp-story-page></amp-story></body></html>',
      rendered:
        '<p><html amp="" lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1"/><script async="" src="https://cdn.ampproject.org/v0.js"></script><script async="" src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story"></script></p>\n<style amp-boilerplate="">body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>\n<p><noscript></p>\n<style amp-boilerplate="">body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style>\n<p></noscript></p>\n<style amp-custom="">\n              amp-story-grid-layer {\n                overflow: visible;\n              }</p>\n<p>              .page-fullbleed-area,\n              .page-background-overlay-area {\n                position: absolute;\n                overflow: hidden;\n                width: 100%;\n                left: 0;\n                height: calc(1.1851851851851851 * 100%);\n                top: calc((1 - 1.1851851851851851) * 100% / 2);\n              }</p>\n<p>              .page-safe-area {\n                overflow: visible;\n                position: absolute;\n                top: 0;\n                bottom: 0;\n                left: 0;\n                right: 0;\n                width: 100%;\n                height: calc(0.84375 * 100%);\n                margin: auto 0;\n              }</p>\n<p>              .mask {\n                position: absolute;\n                overflow: hidden;\n              }</p>\n<p>              .fill {\n                position: absolute;\n                top: 0;\n                left: 0;\n                right: 0;\n                bottom: 0;\n                margin: 0;\n              }\n              </style>\n<p><meta name="web-stories-replace-head-start"/><title>Sample 2</title><link rel="canonical" href="http://localhost:8899/?post_type=web-story&amp;p=307"/><meta name="web-stories-replace-head-end"/></head><body><amp-story standalone="standalone" publisher="Web Stories Dev" publisher-logo-src="http://localhost:8899/wp-content/plugins/web-stories/assets/images/fallback-wordpress-publisher-logo.png" title="Sample 2" poster-portrait-src="http://localhost:8899/wp-content/plugins/web-stories/assets/images/fallback-poster.jpg"><amp-story-page id="3a87c94e-0f6c-4ce3-83bd-6d35c47ff95c" auto-advance-after="7s"><amp-story-grid-layer template="vertical" aspect-ratio="412:618"></p>\n<div class="page-fullbleed-area" style="background-color:#fff">\n<div class="page-safe-area">\n<div style="position:absolute;pointer-events:none;left:0%;top:-9.25926%;width:100%;height:118.51852%;opacity:1">\n<div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0" class="mask" id="el-07f88a13-e21a-4b24-ad7c-7a0f56d7b8c3">\n<div class="fill"></div>\n</div>\n</div>\n</div>\n</div>\n<p></amp-story-grid-layer><amp-story-grid-layer template="vertical" aspect-ratio="412:618"></p>\n<div class="page-fullbleed-area">\n<div class="page-safe-area">\n<div style="position:absolute;pointer-events:none;left:13.34951%;top:23.30097%;width:80.09709%;height:39.96764%;opacity:1">\n<div style="pointer-events:initial;width:100%;height:100%;display:block;position:absolute;top:0;left:0" class="mask" id="el-c65dd091-49d1-466b-83ff-7cb2bb88dea3">\n<div style="position:absolute;width:100%;height:100%;left:0%;top:0%"><amp-img layout="fill" src="http://localhost:8899/wp-content/uploads/2020/07/IMG_8676.png" alt="IMG_8676"></amp-img></div>\n</div>\n</div>\n</div>\n</div>\n<p></amp-story-grid-layer></amp-story-page></amp-story></body></html></p>\n',
      protected: false,
      block_version: 0,
    },
    excerpt: { raw: '', rendered: '<p>Sample 2</p>\n', protected: false },
    author: 1,
    featured_media: 0,
    template: '',
    permalink_template: 'http://localhost:8899/stories/%pagename%',
    generated_slug: 'new-york',
    story_data: {
      version: 24,
      pages: [
        {
          elements: [
            {
              opacity: 100,
              flip: { vertical: false, horizontal: false },
              rotationAngle: 0,
              lockAspectRatio: true,
              backgroundColor: { color: { r: 255, g: 255, b: 255 } },
              x: 1,
              y: 1,
              width: 1,
              height: 1,
              mask: { type: 'rectangle' },
              isBackground: true,
              isDefaultBackground: true,
              type: 'shape',
              id: '07f88a13-e21a-4b24-ad7c-7a0f56d7b8c3',
            },
            {
              opacity: 100,
              flip: { vertical: false, horizontal: false },
              rotationAngle: 0,
              lockAspectRatio: true,
              scale: 100,
              focalX: 50,
              focalY: 50,
              resource: {
                type: 'image',
                mimeType: 'image/png',
                creationDate: '2020-07-06T23:18:02',
                src:
                  'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676.png',
                width: 330,
                height: 247,
                posterId: 0,
                id: 153,
                title: 'IMG_8676',
                alt: 'IMG_8676',
                local: false,
                sizes: {
                  medium: {
                    file: 'IMG_8676-300x225.png',
                    width: 300,
                    height: 225,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-300x225.png',
                  },
                  large: {
                    file: 'IMG_8676-1024x768.png',
                    width: 1024,
                    height: 768,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-1024x768.png',
                  },
                  thumbnail: {
                    file: 'IMG_8676-150x150.png',
                    width: 150,
                    height: 150,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-150x150.png',
                  },
                  medium_large: {
                    file: 'IMG_8676-768x576.png',
                    width: 768,
                    height: 576,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-768x576.png',
                  },
                  '1536x1536': {
                    file: 'IMG_8676-1536x1152.png',
                    width: 1536,
                    height: 1152,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-1536x1152.png',
                  },
                  'post-thumbnail': {
                    file: 'IMG_8676-1200x900.png',
                    width: 1200,
                    height: 900,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-1200x900.png',
                  },
                  'web-stories-poster-portrait': {
                    file: 'IMG_8676-696x928.png',
                    width: 696,
                    height: 928,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-696x928.png',
                  },
                  'web-stories-poster-square': {
                    file: 'IMG_8676-928x928.png',
                    width: 928,
                    height: 928,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-928x928.png',
                  },
                  'web-stories-poster-landscape': {
                    file: 'IMG_8676-928x696.png',
                    width: 928,
                    height: 696,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-928x696.png',
                  },
                  web_stories_thumbnail: {
                    file: 'IMG_8676-150x113.png',
                    width: 150,
                    height: 113,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-150x113.png',
                  },
                  full: {
                    file: 'IMG_8676.png',
                    width: 1936,
                    height: 1452,
                    mime_type: 'image/png',
                    source_url:
                      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676.png',
                  },
                },
              },
              type: 'image',
              x: 55,
              y: 144,
              width: 330,
              height: 247,
              mask: {
                type: 'rectangle',
                showInLibrary: true,
                name: 'Rectangle',
                path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                ratio: 1,
              },
              id: 'c65dd091-49d1-466b-83ff-7cb2bb88dea3',
            },
          ],
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          type: 'page',
          id: '3a87c94e-0f6c-4ce3-83bd-6d35c47ff95c',
        },
      ],
      autoAdvance: true,
      defaultPageDuration: 7,
    },
    featured_media_url: '',
    publisher_logo_url:
      'http://localhost:8899/wp-content/uploads/2020/07/IMG_8676-150x150.png',
    style_presets: { colors: [], textStyles: [] },
    _links: {
      self: [
        { href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/315' },
      ],
      collection: [
        { href: 'http://localhost:8899/wp-json/web-stories/v1/web-story' },
      ],
      about: [{ href: 'http://localhost:8899/wp-json/wp/v2/types/web-story' }],
      author: [
        {
          embeddable: true,
          href: 'http://localhost:8899/wp-json/wp/v2/users/1',
        },
      ],
      'version-history': [
        {
          count: 1,
          href:
            'http://localhost:8899/wp-json/web-stories/v1/web-story/315/revisions',
        },
      ],
      'predecessor-version': [
        {
          id: 316,
          href:
            'http://localhost:8899/wp-json/web-stories/v1/web-story/315/revisions/316',
        },
      ],
      'wp:attachment': [
        { href: 'http://localhost:8899/wp-json/wp/v2/media?parent=315' },
      ],
      'wp:action-publish': [
        { href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/315' },
      ],
      'wp:action-unfiltered-html': [
        { href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/315' },
      ],
      'wp:action-assign-author': [
        { href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/315' },
      ],
      curies: [
        { name: 'wp', href: 'https://api.w.org/{rel}', templated: true },
      ],
    },
  },
};
