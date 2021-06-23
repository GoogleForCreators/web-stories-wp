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
import { storyTooLittleText } from '../storyTooLittleText';

describe('storyTooLittleText', () => {
  it('should return true if too little text', () => {
    const story = {
      id: 'd886c844-5b5c-4b27-a9c3-332df2astory',
      pages: [
        {
          id: 'd886c844-5b5c-4b27-a9c3-332df2aeaaaa',
          elements: [
            {
              id: '25b6f99b-3f69-4351-9e18-31b8ef1d1a61',
              type: 'text',
              content:
                '<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">FRESH</span>\n<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">&amp;&nbsp;</span>\n<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">BRIGHT</span>',
            },
          ],
        },
        {
          id: 'd886c844-5b5c-4b27-a9c3-332df2aeaaab',
          elements: [
            {
              id: 'd886c844-5b5c-4b27-a9c3-332df2aed3f3',
              type: 'text',
              content:
                '<span style="color: #28292b">FRESH</span>\n&amp;&nbsp;\nBRIGHT',
            },
          ],
        },
      ],
    };
    const test = storyTooLittleText(story);
    expect(test).toBe(true);
  });

  it('should return false if there is enough text', () => {
    const story = {
      id: 'd886c844-5b5c-4b27-a9c3-332df2astory',
      pages: [
        {
          id: 'd886c844-5b5c-4b27-a9c3-332df2aeaaaa',
          elements: [
            {
              id: '25b6f99b-3f69-4351-9e18-31b8ef1d1a61',
              type: 'text',
              content:
                '<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">FRESH</span>\n<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">&amp;&nbsp;</span>\n<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">BRIGHT</span>',
            },
          ],
        },
        {
          id: 'd886c844-5b5c-4b27-a9c3-332df2aeaaab',
          elements: [
            {
              id: 'd886c844-5b5c-4b27-a9c3-332df2aed3f3',
              type: 'text',
              content:
                '<span style="color: #28292b">FRESH</span>\n&amp;&nbsp;\nBRIGHT BRIGHT BRIGHT BRIGHT BRIGHT BRIGHT BRIGHT BRIGHT BRIGHT BRIGHT BRIGHT',
            },
          ],
        },
      ],
    };
    expect(storyTooLittleText(story)).toBe(false);
  });
});
