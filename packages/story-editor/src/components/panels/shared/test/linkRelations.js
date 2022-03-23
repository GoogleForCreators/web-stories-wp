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
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import LinkRelations from '../linkRelations';

/**
 * Internal dependencies
 */

describe('LinkRelations', () => {
  function arrange(props) {
    return renderWithTheme(<LinkRelations {...props} />);
  }

  it('should display rel options for valid url', () => {
    arrange({ onChangeRel: jest.fn(), rel: [] });
    expect(screen.getByText('Qualify outbound links')).toBeInTheDocument();
  });

  it('should check rel options for valid url', () => {
    arrange({ onChangeRel: jest.fn(), rel: ['nofollow'] });
    expect(screen.getByText('Qualify outbound links')).toBeInTheDocument();
    const optionA = screen.getByRole('checkbox', { name: 'Nofollow' });
    expect(optionA).toBeChecked();
  });
});
