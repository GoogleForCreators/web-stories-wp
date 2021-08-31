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
import { getStoryColors } from '../getStoryColors';

const templateColors = [
  { label: 'Waterworld Blue', color: '#061b38' },
  { label: 'Arctic White', color: '#fcfcfc' },
  { label: 'Honey Pot Yellow', color: '#ffc864' },
  { color: 'not a real color ' },
  { color: '90909090' },
  { color: 9 },
  { label: 'colorless label' },
];

describe('getStoryColors', () => {
  it('should return structured and clean data that matches the requirements of editor colors', () => {
    expect(getStoryColors(templateColors)).toStrictEqual([
      { color: { b: 56, g: 27, r: 6 } },
      { color: { b: 252, g: 252, r: 252 } },
      { color: { b: 100, g: 200, r: 255 } },
    ]);
  });
});
