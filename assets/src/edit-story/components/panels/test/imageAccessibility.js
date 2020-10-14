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
 * Internal dependencies
 */
import ImageAccessibility from '../imageAccessibility';
import { MULTIPLE_DISPLAY_VALUE } from '../../form';
import { renderPanel } from './_utils';

jest.mock('../../mediaPicker', () => ({
  useMediaPicker: ({ onSelect }) => {
    const image = { url: 'media1' };
    return () => onSelect(image);
  },
}));

describe('Panels/ImageAccessibility', () => {
  const defaultElement = {
    type: 'image',
    resource: { title: '', alt: '', src: '1' },
  };
  function renderImageAccessibility(...args) {
    return renderPanel(ImageAccessibility, ...args);
  }

  it('should render <ImageAccessibility /> panel', () => {
    const { getByRole } = renderImageAccessibility([defaultElement]);
    const input = getByRole('textbox', { name: /Edit: Assistive text/i });
    expect(input).toBeDefined();
  });

  it('should display Mixed placeholder in case of mixed multi-selection', () => {
    const { getByRole } = renderImageAccessibility([
      defaultElement,
      {
        type: 'image',
        resource: { title: '', alt: 'Hello!', src: '2' },
      },
    ]);
    const input = getByRole('textbox', { name: /Edit: Assistive text/i });
    expect(input.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
    expect(input).toHaveValue('');
  });
});
