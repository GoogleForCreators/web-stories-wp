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
import WithLink from '../output';

describe('WithLink', () => {
  function withLink() {
    const props = {
      element: {
        id: '123',
        type: 'image',
        mimeType: 'image/png',
        scale: 1,
        x: 50,
        y: 100,
        height: 1920,
        width: 1080,
        rotationAngle: 0,
        resource: {
          type: 'image',
          mimeType: 'image/png',
          src: 'https://example.com/image.png',
          height: 1920,
          width: 1080,
        },
        link: {
          url: 'https://example.com/',
          icon: 'https://example.com/image.png',
          desc: 'Lorem ipsum dolor',
        },
      },
    };
    return (
      <WithLink {...props}>
        <amp-img src="https://example.com/image.png" layout="fill" />
      </WithLink>
    );
  }

  describe('a[target]', () => {
    it('should use target=_blank', async () => {
      const { container } = render(withLink());
      const a = container.querySelector('a');
      await expect(a.target).toBe('_blank');
      await expect(a.rel).toBe('noreferrer');
    });
  });

  describe('AMP validation', () => {
    it('should produce valid AMP output', async () => {
      await expect(withLink()).toBeValidAMPStoryElement();
    });
  });
});
