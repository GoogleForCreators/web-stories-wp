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
import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import DragHandle from '../handle';
import { noop } from '../../../../../utils/noop';

const handleHeightChange = jest.fn();

describe('DragHandle', () => {
  describe('should raise handleHeightChange when up or down key is pressed', () => {
    afterEach(() => {
      handleHeightChange.mockReset();
    });

    it('when up key is pressed', () => {
      renderWithTheme(
        <DragHandle
          handleHeightChange={handleHeightChange}
          handleExpandToHeightChange={noop}
          handleDoubleClick={noop}
          height={100}
          maxHeight={200}
          minHeight={50}
        />
      );

      fireEvent.keyDown(screen.getByRole('slider'), {
        key: 'ArrowUp',
        which: 38,
      });

      expect(handleHeightChange).toHaveBeenCalledWith(20);
    });

    it('when down key is pressed', () => {
      renderWithTheme(
        <DragHandle
          handleHeightChange={handleHeightChange}
          handleExpandToHeightChange={noop}
          handleDoubleClick={noop}
          height={100}
          maxHeight={200}
          minHeight={50}
        />
      );

      fireEvent.keyDown(screen.getByRole('slider'), {
        key: 'ArrowDown',
        which: 40,
      });

      expect(handleHeightChange).toHaveBeenCalledWith(-20);
    });
  });
});
