/*
 * Copyright 2021 Google LLC
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
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@web-stories-wp/design-system/src/testUtils';

/**
 * Internal dependencies
 */
import { noop } from '../../../../utils/noop';
import Input from '../input';

describe('Input', () => {
  it('should call `onUndo` when meta+z is pressed', () => {
    const mockUndo = jest.fn();

    renderWithProviders(
      <Input
        onTagsChange={noop}
        onInputChange={noop}
        tagDisplayTransformer={noop}
        onUndo={mockUndo}
      />
    );

    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'z', metaKey: true });

    expect(mockUndo).toHaveBeenCalledTimes(1);
  });
});
