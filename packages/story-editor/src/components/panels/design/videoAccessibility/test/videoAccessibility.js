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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import VideoAccessibility, { MIN_MAX } from '../videoAccessibility';
import { MULTIPLE_DISPLAY_VALUE } from '../../../../../constants';
import { renderPanel } from '../../../shared/test/_utils';
import ConfigContext from '../../../../../app/config/context';

function MediaUpload({ render, onSelect }) {
  const open = () => {
    const image = { src: 'media1' };
    onSelect(image);
  };

  return render(open);
}

function arrange(selectedElements) {
  const configValue = {
    allowedMimeTypes: {
      audio: ['audio/mpeg', 'audio/aac', 'audio/wav', 'audio/ogg'],
      image: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp',
      ],
      caption: ['text/vtt'],
      vector: [],
      video: ['video/mp4', 'video/webm'],
    },
    capabilities: {
      hasUploadMediaAction: true,
    },
    MediaUpload,
  };

  const wrapper = ({ children }) => (
    <ConfigContext.Provider value={configValue}>
      {children}
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
    arrange([defaultElement]);
    const input = screen.getByRole('textbox', { name: 'Assistive text' });
    expect(input.maxLength).toBe(MIN_MAX.ALT_TEXT.MAX);
  });

  it('should display Mixed as placeholder in case of mixed value multi-selection', () => {
    arrange([
      defaultElement,
      {
        resource: {
          posterId: 0,
          poster: '',
          alt: 'Hello!',
        },
      },
    ]);
    const description = screen.getByRole('textbox', { name: 'Assistive text' });
    expect(description.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
    expect(description).toHaveValue('');
  });

  it('should simulate a click on <Poster />', () => {
    const { pushUpdate } = arrange([defaultElement]);
    const menuToggle = screen.getByRole('button', { name: 'Video poster' });
    fireEvent.click(menuToggle);
    const editMenuItem = screen.getByRole('menuitem', { name: 'Edit' });
    fireEvent.click(editMenuItem);
    expect(pushUpdate).toHaveBeenCalledTimes(1);
    expect(pushUpdate).toHaveBeenCalledWith({ poster: 'media1' }, true);
  });
});
