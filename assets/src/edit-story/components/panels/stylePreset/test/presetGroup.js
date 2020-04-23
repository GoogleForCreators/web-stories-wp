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
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../../theme';
import PresetGroup from '../presetGroup';
import createSolid from '../../../../utils/createSolid';

function setupPresetGroup() {
  const itemRenderer = jest.fn();
  const presets = [
    createSolid(1, 1, 1),
    createSolid(0, 0, 0),
    createSolid(255, 255, 255),
  ];

  itemRenderer.mockImplementation((color, i, index) => {
    return <button tabIndex={index === i ? 0 : -1} />;
  });

  const { container, getByText } = render(
    <ThemeProvider theme={theme}>
      <PresetGroup
        presets={presets}
        itemRenderer={itemRenderer}
        label={'Colors'}
        type={'color'}
      />
    </ThemeProvider>
  );
  return {
    getByText,
    itemRenderer,
    container,
  };
}

describe('stylePresets/PresetGroup', () => {
  it('should modify active index correctly with arrow keys', () => {
    const { itemRenderer, getByText } = setupPresetGroup();
    expect(itemRenderer).toHaveBeenCalledTimes(3);
    expect(itemRenderer).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      0
    );

    const label = getByText('Colors');
    const group = label.nextSibling;
    expect(group).toBeDefined();

    fireEvent.keyDown(group, {
      key: 'ArrowRight',
      which: 39,
    });

    expect(itemRenderer).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      1
    );

    fireEvent.keyDown(group, {
      key: 'ArrowLeft',
      which: 37,
    });

    expect(itemRenderer).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      0
    );

    fireEvent.keyDown(group, {
      key: 'ArrowDown',
      which: 40,
    });

    expect(itemRenderer).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      2
    );

    fireEvent.keyDown(group, {
      key: 'ArrowUp',
      which: 38,
    });

    expect(itemRenderer).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      0
    );
  });
});
