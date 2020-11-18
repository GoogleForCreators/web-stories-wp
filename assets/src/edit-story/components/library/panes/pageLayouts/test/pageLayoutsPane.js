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
import { renderWithTheme } from '../../../../../testUtils';
import ConfigContext from '../../../../../app/config/context';
import APIContext from '../../../../../app/api/context';
import PageLayoutsPane from '../pageLayoutsPane';

const createTemplate = (name, id) => ({
  name,
  id,
  pages: [{ id: 1 }, { id: 2 }, { id: 3 }],
});

const configValue = {
  api: {},
};

const TEMPLATE_NAMES = ['List', 'Grid', 'Masonary'];

describe('PageLayoutsPane', () => {
  let templates;

  function renderWithTemplates(component) {
    const apiValue = {
      actions: {
        getTemplates: jest.fn().mockResolvedValue(templates),
      },
    };

    return renderWithTheme(
      <ConfigContext.Provider value={configValue}>
        <APIContext.Provider value={apiValue}>{component}</APIContext.Provider>
      </ConfigContext.Provider>
    );
  }

  beforeEach(() => {
    templates = TEMPLATE_NAMES.map((name, index) =>
      createTemplate(name, index)
    );
  });

  it('should render <PageLayoutsPane /> with dummy layouts', () => {
    const { queryByText } = renderWithTemplates(
      <PageLayoutsPane isActive={true} />
    );

    TEMPLATE_NAMES.forEach((name) => {
      expect(queryByText(name)).toBeDefined();
    });
  });
});
