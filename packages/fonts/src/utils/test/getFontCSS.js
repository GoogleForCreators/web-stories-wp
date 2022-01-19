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
import getFontCSS from '../getFontCSS';

describe('getFontCSS', () => {
  it('should not return CSS for unsupported font', () => {
    const actual = getFontCSS('Foo Regular', 'https://example.com/font.eot');
    expect(actual).toBeNull();
  });

  it('should return CSS for woff font', () => {
    const actual = getFontCSS('Foo Regular', 'https://example.com/font.woff');
    expect(actual).toContain('font-family: "Foo Regular";');
    expect(actual).toContain(
      "src: url('https://example.com/font.woff') format('woff');"
    );
  });

  it('should return CSS for woff2 font', () => {
    const actual = getFontCSS('Foo Regular', 'https://example.com/font.woff2');
    expect(actual).toContain('font-family: "Foo Regular";');
    expect(actual).toContain(
      "src: url('https://example.com/font.woff2') format('woff2');"
    );
  });

  it('should return CSS for ttf font', () => {
    const actual = getFontCSS('Foo Regular', 'https://example.com/font.ttf');
    expect(actual).toContain('font-family: "Foo Regular";');
    expect(actual).toContain(
      "src: url('https://example.com/font.ttf') format('truetype');"
    );
  });

  it('should return CSS for otf font', () => {
    const actual = getFontCSS('Foo Regular', 'https://example.com/font.otf');
    expect(actual).toContain('font-family: "Foo Regular";');
    expect(actual).toContain(
      "src: url('https://example.com/font.otf') format('opentype');"
    );
  });
});
