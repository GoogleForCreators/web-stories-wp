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
import { getMediaOrigin } from '..';

describe('getMediaOrigin', () => {
  it.each([
    [
      {
        top: 1,
        right: 0,
        bottom: -1,
        left: -1,
      },
      {
        horizontal: 100,
        vertical: 50,
      },
    ],
    [
      {
        top: 1,
        right: 1,
        bottom: -1,
        left: 0,
      },
      {
        horizontal: 0,
        vertical: 50,
      },
    ],
    [
      {
        top: 1,
        right: 1,
        bottom: 0,
        left: -1,
      },
      {
        horizontal: 50,
        vertical: 100,
      },
    ],
    [
      {
        top: 0,
        right: 1,
        bottom: -1,
        left: -1,
      },
      {
        horizontal: 50,
        vertical: 0,
      },
    ],
    [
      {
        top: 1,
        right: 1,
        bottom: -1,
        left: -1,
      },
      {
        horizontal: 50,
        vertical: 50,
      },
    ],
    [
      {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      {
        horizontal: 50,
        vertical: 50,
      },
    ],
  ])('given %p returns %p', (offset, origin) => {
    expect(getMediaOrigin(offset)).toStrictEqual(origin);
  });
});
