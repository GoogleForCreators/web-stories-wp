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
import LinkPanel from '../link';
import StoryContext from '../../../../../app/story/context';
import { MULTIPLE_DISPLAY_VALUE } from '../../../../../constants';
import { renderPanel } from '../../../shared/test/_utils';

jest.mock('../../../../../elements');

function renderLinkPanel(selectedElements) {
  const configValue = {
    capabilities: {
      hasUploadMediaAction: true,
    },
  };

  const storyContextValue = {
    state: {
      currentPage: { elements: [] },
    },
  };

  const wrapper = (params) => (
    <ConfigContext.Provider value={configValue}>
      <StoryContext.Provider value={storyContextValue}>
        {params.children}
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );

  return renderPanel(LinkPanel, selectedElements, wrapper);
}

describe('Panels/Link', () => {
  const DEFAULT_ELEMENT = {
    id: '1',
    isBackground: false,
    x: 10,
    y: 10,
    width: 100,
    height: 80,
    rotationAngle: 0,
    link: {
      url: '',
    },
  };

  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:link',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should not display metadata fields if URL is missing', () => {
    renderLinkPanel([DEFAULT_ELEMENT]);
    expect(
      screen.getByRole('textbox', {
        name: 'Element link',
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Link description',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Edit link icon',
      })
    ).not.toBeInTheDocument();
  });

  it('should display an error message for invalid URLs', () => {
    renderLinkPanel([
      {
        ...DEFAULT_ELEMENT,
        link: {
          url: 'http://',
        },
      },
    ]);
    expect(screen.getByText('Invalid web address.')).toBeInTheDocument();
  });

  it('should not display metadata fields if URL is invalid', () => {
    renderLinkPanel([
      {
        ...DEFAULT_ELEMENT,
        link: {
          url: 'http://',
        },
      },
    ]);
    expect(
      screen.queryByRole('textbox', {
        name: 'Link description',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Edit link icon',
      })
    ).not.toBeInTheDocument();
  });

  it('should display Mixed placeholder in case of mixed values multi-selection', () => {
    renderLinkPanel([
      {
        ...DEFAULT_ELEMENT,
        link: {
          url: 'http://example.com',
          desc: 'Example',
        },
      },
      {
        ...DEFAULT_ELEMENT,
        id: 2,
      },
    ]);

    const linkInput = screen.getByRole('textbox', {
      name: 'Element link',
    });
    expect(linkInput.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
    expect(linkInput).toHaveValue('');

    const descInput = screen.queryByRole('textbox', {
      name: 'Link description',
    });
    expect(descInput.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
    expect(descInput).toHaveValue('');
  });
});
