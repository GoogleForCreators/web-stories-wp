/*
 * Copyright 2021 Google LLC
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
import { BLOCK_TYPE_LATEST_STORIES, BLOCK_TYPE_URL } from './constants';
import metadata from './block';

const { attributes } = metadata;

const transforms = {
  from: [
    {
      type: 'shortcode',
      tag: 'web_stories_embed',
      attributes: {
        ...attributes,
        align: {
          type: 'string',
          shortcode: ({ named: { align } }) => {
            return align;
          },
        },
        height: {
          type: 'number',
          shortcode: ({ named: { height } }) => {
            return height;
          },
        },
        poster: {
          type: 'string',
          shortcode: ({ named: { poster } }) => {
            return poster;
          },
        },
        title: {
          type: 'string',
          shortcode: ({ named: { title } }) => {
            return title;
          },
        },
        url: {
          type: 'string',
          shortcode: ({ named: { url } }) => {
            return url;
          },
        },
        width: {
          type: 'number',
          shortcode: ({ named: { width } }) => {
            return width;
          },
        },
        blockType: {
          type: 'string',
          default: BLOCK_TYPE_URL,
        },
      },
      priority: 9,
    },
    {
      type: 'shortcode',
      tag: 'web_stories',
      attributes: {
        ...attributes,
        blockType: {
          type: 'string',
          default: BLOCK_TYPE_LATEST_STORIES,
        },
        align: {
          type: 'string',
          shortcode: ({ named: { align } }) => {
            return align;
          },
        },
        archiveLinkLabel: {
          type: 'string',
          shortcode: ({ named: { archive_link_label } }) => {
            return archive_link_label;
          },
        },
        viewType: {
          type: 'string',
          shortcode: ({ named: { view } }) => {
            return view;
          },
        },
        numOfStories: {
          type: 'number',
          shortcode: ({ named: { number } }) => {
            return number;
          },
        },
        numOfColumns: {
          type: 'number',
          shortcode: ({ named: { columns } }) => {
            return columns;
          },
        },
        circleSize: {
          type: 'number',
          shortcode: ({ named: { circle_size } }) => {
            return circle_size;
          },
        },
        fieldState: {
          type: 'object',
          shortcode: ({
            named: { title, excerpt, author, date, archive_link, image_align },
          }) => {
            // Need this type conversion as the block is expecting following to be boolean.
            return {
              show_archive_link: 'true' === archive_link,
              show_author: 'true' === author,
              show_date: 'true' === date,
              show_excerpt: 'true' === excerpt,
              show_image_align: 'true' === image_align,
              show_title: 'true' === title,
            };
          },
        },
      },
    },
  ],
};

export default transforms;
