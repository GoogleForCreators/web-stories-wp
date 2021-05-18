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
import { act, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../../testUtils';
import ConfigContext from '../../../../../app/config/context';
import APIContext from '../../../../../app/api/context';
import StoryContext from '../../../../../app/story/context';
import TransformContext from '../../../../transform/context';
import { createPage } from '../../../../../elements';
import PageTemplatesPane from '../pageTemplatesPane';
import { PAGE_TEMPLATE_TYPES } from '../constants';
import LibraryContext from '../../../context';

const createTemplate = (title, id) => ({
  title,
  id,
  pages: [
    createPage({ pageTemplateType: 'cover' }),
    createPage({ pageTemplateType: 'section' }),
  ],
});

const TEMPLATE_NAMES = ['List', 'Grid', 'Masonary'];

const configValue = {
  api: {},
};
const transformValue = {
  actions: {
    registerTransformHandler: () => {},
  },
};

function flushPromiseQueue() {
  return new Promise((resolve) => resolve());
}

describe('PageTemplatesPane', () => {
  const getPageTemplates = jest.fn();
  const getCustomPageTemplates = jest.fn();
  let templates;

  function renderWithTemplates() {
    const apiValue = {
      actions: {
        getPageTemplates,
        getCustomPageTemplates,
      },
    };
    const storyContext = {
      actions: {
        replaceCurrentPage: jest.fn(),
      },
      state: {
        currentPage: createPage(),
      },
    };
    const libraryContext = {
      actions: {
        setSavedTemplates: jest.fn(),
      },
      state: {
        savedTemplates: jest.fn(),
      },
    };

    return renderWithTheme(
      <TransformContext.Provider value={transformValue}>
        <ConfigContext.Provider value={configValue}>
          <APIContext.Provider value={apiValue}>
            <StoryContext.Provider value={storyContext}>
              <LibraryContext.Provider value={libraryContext}>
                <PageTemplatesPane isActive />
              </LibraryContext.Provider>
            </StoryContext.Provider>
          </APIContext.Provider>
        </ConfigContext.Provider>
      </TransformContext.Provider>
    );
  }

  beforeEach(() => {
    templates = TEMPLATE_NAMES.map((name, index) =>
      createTemplate(name, index)
    );
    getPageTemplates.mockResolvedValue(templates);
  });

  it('should render <PageTemplatesPane /> with dummy layouts', async () => {
    renderWithTemplates();

    await act(async () => {
      // Needed to flush all promises to get templates to resolve
      await flushPromiseQueue();
    });

    Object.values(PAGE_TEMPLATE_TYPES)
      .map(({ name }) => name)
      .forEach((name) => {
        expect(screen.queryByText(name)).toBeInTheDocument();
      });

    TEMPLATE_NAMES.forEach((name) => {
      expect(screen.queryByLabelText(`${name} Cover`)).toBeInTheDocument();
      expect(screen.queryByLabelText(`${name} Section`)).toBeInTheDocument();
    });
  });
});
