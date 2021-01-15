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
import ConfigContext from '../../../../../app/config/context';
import { renderPanel } from '../../../shared/test/_utils';
import Captions from '../captions';

describe('Panels/Captions', () => {
  const defaultElement = {
    type: 'video',
    resource: { posterId: 0, title: '', poster: '', alt: '' },
    tracks: [],
  };
  function renderCaptions(...args) {
    const configValue = {
      capabilities: {
        hasUploadMediaAction: true,
      },
    };

    const wrapper = (params) => (
      <ConfigContext.Provider value={configValue}>
        {params.children}
      </ConfigContext.Provider>
    );

    return renderPanel(Captions, ...args, wrapper);
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
    const { getByRole } = renderCaptions([defaultElement]);
    const captionRegion = getByRole('region', { name: /Captions/i });
    expect(captionRegion).toBeInTheDocument();
  });

  it('should display Mixed in case of mixed value multi-selection', () => {
    const { getByRole } = renderCaptions([
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
    const input = getByRole('textbox', { name: 'Filename' });
    expect(input).toHaveValue(MULTIPLE_DISPLAY_VALUE);
  });
});
