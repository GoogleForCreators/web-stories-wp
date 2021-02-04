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
import Popup from '../index';
import { renderWithTheme } from '../../../testUtils';

describe('Popup', () => {
  it('should render popup', () => {
    const anchor = {
      current: document.createElement('div'),
    };
    document.body.append(anchor.current);
    const { getByText } = renderWithTheme(
      <Popup anchor={anchor} isOpen={true}>
        {'Hello World!'}
      </Popup>
    );

    const popup = getByText('Hello World!');
    expect(popup).toBeInTheDocument();
  });

  // TODO(wassgha): Tests for different placements

  // TODO(wassgha): Test for default placement

  it('should not render popup when isOpen set to false', () => {
    const anchor = {
      current: document.createElement('div'),
    };
    document.body.append(anchor.current);
    const { queryByText } = renderWithTheme(
      <Popup anchor={anchor} isOpen={false}>
        {'Hello World!'}
      </Popup>
    );

    const popup = queryByText('Hello World!');
    expect(popup).not.toBeInTheDocument();
  });
});
