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
import { act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../../testUtils';
import ConfigContext from '../../../../../app/config/context';
import APIContext from '../../../../../app/api/context';
import PageLayoutsPane from '../pageLayoutsPane';

const createTemplate = (title, id) => ({
  title,
  id,
  pages: [{ id: 1 }, { id: 2 }, { id: 3 }],
});

const configValue = {
  api: {},
};

const TEMPLATE_NAMES = ['List', 'Grid', 'Masonary'];

function flushPromiseQueue() {
  return new Promise((resolve) => resolve());
}

describe('PageLayoutsPane', () => {
  let getTemplates = jest.fn();
  let templates;

  function renderWithTemplates() {
    const apiValue = {
      actions: {
        getTemplates,
      },
    };

    return renderWithTheme(
      <ConfigContext.Provider value={configValue}>
        <APIContext.Provider value={apiValue}>
          <PageLayoutsPane isActive={true} />
        </APIContext.Provider>
      </ConfigContext.Provider>
    );
  }

  beforeEach(() => {
    templates = TEMPLATE_NAMES.map((name, index) =>
      createTemplate(name, index)
    );
    getTemplates.mockResolvedValue(templates);
  });

  it('should render <PageLayoutsPane /> with dummy layouts', async () => {
    const { queryByText } = renderWithTemplates();

    await act(async () => {
      // Needed to flush all promises to get templates to resolve
      await flushPromiseQueue();
    });

    TEMPLATE_NAMES.forEach((name) => {
      expect(queryByText(name)).toBeInTheDocument();
    });
  });
});
