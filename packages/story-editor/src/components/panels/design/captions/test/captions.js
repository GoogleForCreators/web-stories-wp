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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import ConfigContext from '../../../../../app/config/context';
import { renderPanel } from '../../../shared/test/_utils';
import Captions from '../captions';
import { MULTIPLE_DISPLAY_VALUE } from '../../../../../constants';

function MediaUpload({ render }) {
  const open = jest.fn();
  return render(open);
}

describe('Panels/Captions', () => {
  const defaultElement = {
    type: 'video',
    resource: { posterId: 0, poster: '', alt: '' },
    tracks: [],
  };
  function arrange(config, selectedElements) {
    const configValue = {
      capabilities: {
        hasUploadMediaAction: true,
      },
      allowedMimeTypes: { caption: ['text/vtt'] },
      ...config,
      MediaUpload,
    };

    const wrapper = ({ children }) => (
      <ConfigContext.Provider value={configValue}>
        {children}
      </ConfigContext.Provider>
    );

    return renderPanel(Captions, selectedElements, wrapper);
  }

  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:caption',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render <Captions /> panel', () => {
    arrange({}, [defaultElement]);
    const captionRegion = screen.getByRole('region', {
      name: /Caption and subtitles/i,
    });
    expect(captionRegion).toBeInTheDocument();
  });

  it('should not render <Captions /> panel', () => {
    arrange(
      {
        capabilities: {
          hasUploadMediaAction: false,
        },
      },
      [defaultElement]
    );
    const captionRegion = screen.queryByRole('region', {
      name: /Caption and subtitles/i,
    });
    expect(captionRegion).not.toBeInTheDocument();
  });

  it('should display Mixed in case of mixed value multi-selection', () => {
    arrange({}, [
      defaultElement,
      {
        resource: {
          posterId: 0,
          title: 'Hello, video!',
          poster: '',
          alt: 'Hello!',
        },
        tracks: ['Some track here'],
      },
    ]);
    const input = screen.getByRole('textbox', { name: 'Filename' });
    expect(input).toHaveValue(MULTIPLE_DISPLAY_VALUE);
  });
});
