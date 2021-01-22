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
import React from 'react';
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import DragHandle from '../handle';
import { renderWithTheme } from '../../../../../testUtils';

describe('DragHandle', () => {
  describe('should raise handleHeightChange when up or down key is pressed', () => {
    const handleHeightChange = jest.fn();
    let slider;

    beforeEach(() => {
      handleHeightChange.mockReset();
      slider = renderWithTheme(
        <DragHandle handleHeightChange={handleHeightChange} />
      ).getByRole('slider');
    });

    it('when up key is pressed', () => {
      fireEvent.keyDown(slider, { key: 'ArrowUp', which: 38 });
      expect(handleHeightChange).toHaveBeenCalledWith(20);
    });

    it('when down key is pressed', () => {
      fireEvent.keyDown(slider, { key: 'ArrowDown', which: 40 });
      expect(handleHeightChange).toHaveBeenCalledWith(-20);
    });
  });
});
