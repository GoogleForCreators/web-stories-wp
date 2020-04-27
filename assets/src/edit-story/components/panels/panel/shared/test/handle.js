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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { ThemeProvider } from 'styled-components';
import DragHandle from '../handle';
import theme from '../../../../../theme';

const mockBind = jest.fn();
const mockUnbind = jest.fn();

jest.mock('Mousetrap', () =>
  jest.fn().mockImplementation(() => ({
    bind: mockBind,
    unbind: mockUnbind,
  }))
);

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

describe('DragHandle', () => {
  var bindings;

  beforeEach(() => {
    bindings = {};
    mockBind.mockReset();
    mockUnbind.mockReset();

    mockBind.mockImplementation((name, fn) => (bindings[name] = fn));
    mockUnbind.mockImplementation((name) => delete bindings[name]);
  });

  it('should call Mousetrap.unbind on unmount', () => {
    const component = arrange(<DragHandle />);
    expect(Object.keys(bindings)).toHaveLength(2);

    // Mousetrap.unbind() must be called when the component is unmounted.
    component.unmount();
    expect(Object.keys(bindings)).toHaveLength(0);
  });

  describe('should raise handleHeightChange when up or down key is pressed', () => {
    const handleHeightChange = jest.fn();
    const mockEvent = {
      stopPropagation: () => {},
      preventDefault: () => {},
      target: {},
    };

    beforeEach(() => {
      handleHeightChange.mockReset();
      arrange(<DragHandle handleHeightChange={handleHeightChange} />);
    });

    it('when up key is pressed', () => {
      bindings['up'](mockEvent);
      expect(handleHeightChange).toHaveBeenCalledWith(20);
    });

    it('when down key is pressed', () => {
      bindings['down'](mockEvent);
      expect(handleHeightChange).toHaveBeenCalledWith(-20);
    });
  });
});
