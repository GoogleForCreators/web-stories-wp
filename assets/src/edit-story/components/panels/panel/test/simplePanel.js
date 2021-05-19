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
import SimplePanel from '../simplePanel';
import { renderWithTheme } from '../../../../testUtils';

describe('Panels/Panel/SimplePanel', () => {
  it('should render <SimplePanel />', () => {
    renderWithTheme(
      <SimplePanel name="simple-panel" title="Simple Panel">
        <div>{'Simple Panel Content'}</div>
      </SimplePanel>
    );

    const titleElement = screen.getByText('Simple Panel');
    const contentElement = screen.getByText('Simple Panel Content');

    expect(titleElement).toBeInTheDocument();
    expect(contentElement).toBeInTheDocument();
  });

  describe('should render <PanelTitle>', () => {
    const titleName = 'Size & Position';
    const contentText = 'Panel Content';

    beforeEach(() => {
      renderWithTheme(
        <SimplePanel name="simple-panel" title={titleName}>
          <div>{contentText}</div>
        </SimplePanel>
      );
    });

    it('should have a label that matches the title name', () => {
      const titleElement = screen.getByRole('button', { name: titleName });
      const label = titleElement.getAttribute('aria-label');
      expect(label).toStrictEqual(titleName);
    });

    it('should have an expand status by default', () => {
      const titleElement = screen.getByRole('button', { name: titleName });
      const isExpanded = titleElement.getAttribute('aria-expanded');
      expect(isExpanded).toBeTruthy();
    });
  });
});
