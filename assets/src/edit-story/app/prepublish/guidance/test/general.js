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
import { render } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { PRE_PUBLISH_MESSAGE_TYPES } from '../../constants';
import * as generalGuidelines from '../general';

describe('Pre-publish checklist - general guidelines (guidance)', () => {
  it('should return guidance if story has less than 4 pages or more than 30 pages', () => {
    const storyTooShort = generalGuidelines.storyPagesCount({
      id: 123,
      title: 'Publishers HATE her!',
      pages: new Array(3),
    });
    const storyTooLong = generalGuidelines.storyPagesCount({
      id: 456,
      title: 'Carrot Cake Recipe',
      pages: new Array(31),
    });
    const testUndefined = generalGuidelines.storyPagesCount({
      id: 567,
      title: "World's best banana bread",
      pages: new Array(20),
    });

    expect(storyTooShort).not.toBeUndefined();
    expect(storyTooShort.message).toMatchInlineSnapshot(`"Make story longer"`);
    expect(storyTooShort.storyId).toStrictEqual(123);

    expect(storyTooLong).not.toBeUndefined();
    expect(storyTooLong.message).toMatchInlineSnapshot(`"Make story shorter"`);
    expect(storyTooLong.storyId).toStrictEqual(456);

    expect(testUndefined).toBeUndefined();
  });

  it('should return guidance if the story title is longer than 40 characters', () => {
    const testStory = {
      id: 123,
      title:
        'If you want to make an apple pie from scratch, you must first create the universe.',
    };
    const testUndefined = generalGuidelines.storyTitleLength({
      id: 345,
      title: 'Once, there was a man from Nantucket...',
    });
    const test = generalGuidelines.storyTitleLength(testStory);
    expect(test).not.toBeUndefined();

    const { getByText } = render(test.help);
    getByText(/40 characters/);
    expect(test.type).toStrictEqual(PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE);
    expect(test.message).toMatchInlineSnapshot(`"Make story title shorter"`);
    expect(test.storyId).toStrictEqual(testStory.id);
    expect(testUndefined).toBeUndefined();
  });
});
