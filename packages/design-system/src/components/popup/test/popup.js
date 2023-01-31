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
import Popup from '../popup';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

// TODO tests with karma to easily get positions and interact

describe('Popup', () => {
  it('should render popup', () => {
    const anchor = {
      current: document.createElement('div'),
    };
    document.body.append(anchor.current);
    renderWithProviders(
      <Popup anchor={anchor} isOpen>
        {'Hello World!'}
      </Popup>
    );

    const popup = screen.getByText('Hello World!');
    expect(popup).toBeInTheDocument();
  });

  it('should not render popup when isOpen set to false', () => {
    const anchor = {
      current: document.createElement('div'),
    };
    document.body.append(anchor.current);
    renderWithProviders(
      <Popup anchor={anchor} isOpen={false}>
        {'Hello World!'}
      </Popup>
    );

    const popup = screen.queryByText('Hello World!');
    expect(popup).not.toBeInTheDocument();
  });
});
