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
import { withProtocol, isValidUrl } from '..';

describe('isValidUrl', () => {
  it('should return correct results for valid URL', () => {
    expect(isValidUrl('foo-bar')).toBeFalse();
    expect(isValidUrl('foo-bar.jpg')).toBeFalse();
    expect(isValidUrl('//foo-bar')).toBeFalse();
    expect(isValidUrl('http://foo-bar')).toBeTrue();
    expect(isValidUrl('https://foo-bar.com')).toBeTrue();
    expect(isValidUrl('https://foo-bar.com/test.jpg')).toBeTrue();
    expect(isValidUrl('https://foo-bar.com/example.html')).toBeTrue();
    expect(isValidUrl('https://foo-bar.com/font.ttf')).toBeTrue();
    expect(isValidUrl('tel:1234567')).toBeTrue();
    expect(isValidUrl('mailto:example@example.com')).toBeTrue();
  });
});

describe('withProtocol', () => {
  it('should add protocol correctly if applicable', () => {
    expect(withProtocol('https://foo-bar.com/test.jpg')).toBe(
      'https://foo-bar.com/test.jpg'
    );
    expect(withProtocol('http://foo-bar.com/test.jpg')).toBe(
      'http://foo-bar.com/test.jpg'
    );
    expect(withProtocol('foo-bar.com/test.jpg')).toBe(
      'https://foo-bar.com/test.jpg'
    );
  });
});
