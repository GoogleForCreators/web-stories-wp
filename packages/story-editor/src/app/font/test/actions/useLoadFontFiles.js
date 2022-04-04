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
import { renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useLoadFontFiles from '../../actions/useLoadFontFiles';

const DEFAULT_FONT = {
  font: {
    family: 'Font',
    service: 'fonts.google.com',
  },
  fontWeight: 400,
  fontStyle: 'normal',
  content: 'Fill in some text.',
};

const CUSTOM_FONT = {
  font: {
    family: 'Bar Regular',
    service: 'custom',
    url: 'https://fonts.example.com/bar.ttf',
  },
  fontWeight: 400,
  fontStyle: 'normal',
  content: 'Fill in some text.',
};

/* eslint-disable testing-library/no-node-access */

describe('useLoadFontFiles', () => {
  afterEach(() => {
    document.querySelectorAll('link,style').forEach((el) => el.remove());
  });

  it('should enqueue fonts', () => {
    expect(document.getElementById('font-css')).toBeNull();

    renderHook(async () => {
      const { maybeEnqueueFontStyle } = useLoadFontFiles();

      await maybeEnqueueFontStyle([DEFAULT_FONT, CUSTOM_FONT]);
    });

    expect(document.getElementById('font-css')).toBeDefined();
    expect(document.getElementById('bar-regular-css')).toBeDefined();
  });

  it('should skip font with unknown service', () => {
    expect(document.getElementById('font-css')).toBeNull();

    renderHook(async () => {
      const { maybeEnqueueFontStyle } = useLoadFontFiles();

      await maybeEnqueueFontStyle([
        { ...DEFAULT_FONT, font: { ...DEFAULT_FONT.font, service: 'abcd' } },
      ]);
    });

    expect(document.getElementById('font-css')).toBeNull();
  });

  it('waits for all promises to be settled', () => {
    expect(document.getElementById('font-css')).toBeNull();

    renderHook(async () => {
      const { maybeEnqueueFontStyle } = useLoadFontFiles();

      await maybeEnqueueFontStyle([{}, DEFAULT_FONT]);
    });

    expect(document.querySelectorAll('link')).toHaveLength(1);
    expect(document.getElementById('font-css')).toBeDefined();
  });
});

/* eslint-enable testing-library/no-node-access */
