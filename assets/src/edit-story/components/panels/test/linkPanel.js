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
import ConfigContext from '../../../app/config/context';
import LinkPanel from '../link';
import { renderPanel } from './_utils';

jest.mock('../../../elements');

function renderLinkPanel(selectedElements) {
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

  return renderPanel(LinkPanel, selectedElements, wrapper);
}

describe('Panels/Link', () => {
  it('should display an error message for invalid URLs', () => {
    const defaultElement = {
      id: '1',
      isBackground: false,
      x: 10,
      y: 10,
      width: 100,
      height: 80,
      rotationAngle: 0,
      link: {
        url: 'http://',
      },
    };

    renderLinkPanel([defaultElement]);
    expect(screen.getByText('Invalid web address.')).toBeInTheDocument();
  });
});
