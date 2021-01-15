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
import { MULTIPLE_DISPLAY_VALUE } from '../../../../../constants';
import { renderPanel } from '../../../shared/test/_utils';
import ImageAccessibility from '../imageAccessibility';

jest.mock('../../../../mediaPicker', () => ({
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

  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:imageAccessibility',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render <ImageAccessibility /> panel', () => {
    const { getByRole } = renderImageAccessibility([defaultElement]);
    const input = getByRole('textbox', { name: 'Assistive text' });
    expect(input).toBeInTheDocument();
  });

  it('should display Mixed placeholder in case of mixed multi-selection', () => {
    const { getByRole } = renderImageAccessibility([
      defaultElement,
      {
        type: 'image',
        resource: { title: '', alt: 'Hello!', src: '2' },
      },
    ]);
    const input = getByRole('textbox', { name: 'Assistive text' });
    expect(input.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
    expect(input).toHaveValue('');
  });
});
