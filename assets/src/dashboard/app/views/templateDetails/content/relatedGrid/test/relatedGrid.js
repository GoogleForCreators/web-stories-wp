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
import RelatedGrid from '../';
import { renderWithProviders } from '../../../../../../testUtils';
import LayoutProvider from '../../../../../../components/layout/provider';
import { formattedTemplatesArray } from '../../../../../../storybookUtils';

describe('Template Details <RelatedGrid />', () => {
  it('should render a grid of related templates', () => {
    const { queryAllByRole } = renderWithProviders(
      <LayoutProvider>
        <RelatedGrid
          pageSize={{ width: 200, height: 350 }}
          relatedTemplates={formattedTemplatesArray.slice(0, 3)}
          templateActions={{
            createStoryFromTemplate: jest.fn(),
            handlePreviewTemplate: jest.fn(),
          }}
        />
      </LayoutProvider>
    );

    const gridItems = queryAllByRole('listitem');

    expect(gridItems).toHaveLength(3);
  });

  it('should not render a grid of related templates when there are no related templates', () => {
    const { queryByRole } = renderWithProviders(
      <LayoutProvider>
        <RelatedGrid
          pageSize={{ width: 200, height: 350 }}
          relatedTemplates={[]}
          templateActions={{
            createStoryFromTemplate: jest.fn(),
            handlePreviewTemplate: jest.fn(),
          }}
        />
      </LayoutProvider>
    );

    const gridItems = queryByRole('listitem');

    expect(gridItems).not.toBeInTheDocument();
  });
});
