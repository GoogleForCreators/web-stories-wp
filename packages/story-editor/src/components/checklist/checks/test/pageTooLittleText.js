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
 * External dependencies
 */
import { ELEMENT_TYPES } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import { pageTooLittleText } from '../pageTooLittleText';

describe('pageTooLittleText', () => {
  it('should return true if too little text', () => {
    const page = {
      id: 'd886c844-5b5c-4b27-a9c3-332df2aeaaaa',
      elements: [
        {
          id: '25b6f99b-3f69-4351-9e18-31b8ef1d1a61',
          type: ELEMENT_TYPES.TEXT,
          content:
            '<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">FRESH</span>',
        },
      ],
    };
    const test = pageTooLittleText(page);
    expect(test).toBeTrue();
  });

  it('should return false if there is enough text', () => {
    const page = {
      id: 'd886c844-5b5c-4b27-a9c3-332df2aeaaaa',
      elements: [
        {
          id: '25b6f99b-3f69-4351-9e18-31b8ef1d1a61',
          type: ELEMENT_TYPES.TEXT,
          content:
            '<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">FRESH</span>\n<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">&amp;&nbsp;</span>\n<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">BRIGHT</span>',
        },
        {
          id: '85b6f99b-3f69-4351-9e18-31b8ef1d1a61',
          type: ELEMENT_TYPES.TEXT,
          content:
            '<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">"I wish it need not have happened in my time," said Frodo.\n"So do I," said Gandalf\n"and so do all who live to see such times. But that is not for them to decide. All we have to decide is what to do with the time that is given us.</span>\n<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">&amp;&nbsp;</span>\n<span style="font-weight: 400; color: #fff; letter-spacing: 0.09em">The Fellowship of the Ring</span>',
        },
      ],
    };
    expect(pageTooLittleText(page)).toBeFalse();
  });
});
