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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import VideoAccessibility, { MIN_MAX } from '../videoAccessibility';
import { MULTIPLE_DISPLAY_VALUE } from '../../../../../constants';
import { renderPanel } from '../../../shared/test/_utils';
import ConfigContext from '../../../../../app/config/context';

jest.mock('../../../../mediaPicker', () => ({
  useMediaPicker: ({ onSelect }) => {
    const image = { url: 'media1' };
    return () => onSelect(image);
  },
}));

function renderVideoAccessibility(selectedElements) {
  const configValue = {
    allowedImageFileTypes: ['gif', 'jpe', 'jpeg', 'jpg', 'png'],
    allowedImageMimeTypes: [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif',
    ],
  };

  const wrapper = (params) => (
    <ConfigContext.Provider value={configValue}>
      {params.children}
    </ConfigContext.Provider>
  );

  return renderPanel(VideoAccessibility, selectedElements, wrapper);
}

describe('Panels/VideoAccessibility', () => {
  const defaultElement = {
    type: 'video',
    resource: { posterId: 0, poster: '', alt: '' },
  };

  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:videoAccessibility',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should trim video description to maximum allowed length if exceeding', () => {
    const { getByPlaceholderText } = renderVideoAccessibility([defaultElement]);
    const input = getByPlaceholderText(
      'Add assistive text for visually impaired users'
    );
    expect(input.maxLength).toBe(MIN_MAX.ALT_TEXT.MAX);
  });

  it('should display Mixed as placeholder in case of mixed value multi-selection', () => {
    const { getByRole } = renderVideoAccessibility([
      defaultElement,
      {
        resource: {
          posterId: 0,
          poster: '',
          alt: 'Hello!',
        },
      },
    ]);
    const description = getByRole('textbox', { name: 'Assistive text' });
    expect(description.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
    expect(description).toHaveValue('');
  });

  it('should simulate a click on <Poster />', () => {
    const { getByRole, pushUpdate } = renderVideoAccessibility([
      defaultElement,
    ]);
    const menuToggle = getByRole('button', { name: 'Video poster' });
    fireEvent.click(menuToggle);
    const editMenuItem = getByRole('menuitem', { name: 'Edit' });
    fireEvent.click(editMenuItem);
    expect(pushUpdate).toHaveBeenCalledTimes(1);
    expect(pushUpdate).toHaveBeenCalledWith({ poster: 'media1' }, true);
  });
});
