/**
 * @jest-environment node
 */
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
// eslint-disable-next-line header/header -- Needed because of the @jest-environment comment.
import { join } from 'path';
import { readFileSync } from 'fs';

/**
 * Internal dependencies
 */
import getFontMetrics from '../getFontMetrics';

describe('getFontMetrics', () => {
  it('should return font metrics', async () => {
    global.fetch.mockImplementationOnce(() => {
      return {
        ok: true,
        arrayBuffer: () =>
          Promise.resolve(
            readFileSync(join(__dirname, '/fixtures/abezee.ttf'))
          ),
      };
    });

    const result = await getFontMetrics(
      'http://fonts.gstatic.com/s/abeezee/v13/esDR31xSG-6AGleN6tKukbcHCpE.ttf'
    );

    expect(result).toStrictEqual({
      asc: 920,
      capH: 700,
      des: -262,
      hAsc: 920,
      hDes: -262,
      lGap: 0,
      tAsc: 920,
      tDes: -262,
      tLGap: 0,
      upm: 1000,
      wAsc: 920,
      wDes: 262,
      xH: 520,
      yMax: 920,
      yMin: -262,
    });
  });
});
