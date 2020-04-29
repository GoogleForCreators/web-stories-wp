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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import PresetGroup from '../presetGroup';
import createSolid from '../../../../utils/createSolid';
import { renderWithTheme } from '../../../../testUtils';

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

  const { container, getByText } = renderWithTheme(
    <PresetGroup
      presets={presets}
      itemRenderer={itemRenderer}
      label={'Colors'}
      type={'color'}
    />
  );
  return {
    getByText,
    itemRenderer,
    container,
  };
}
const getThirdArguments = (calls) => {
  return [...calls.map((args) => args[2])];
};

describe('stylePresets/PresetGroup', () => {
  it('should modify active index correctly with arrow keys', () => {
    const { itemRenderer, getByText } = setupPresetGroup();
    expect(getThirdArguments(itemRenderer.mock.calls)).toStrictEqual([0, 0, 0]);

    const label = getByText('Colors');
    const group = label.nextSibling;
    expect(group).toBeDefined();

    itemRenderer.mockReset();
    fireEvent.keyDown(group, {
      key: 'ArrowRight',
      which: 39,
    });

    expect(getThirdArguments(itemRenderer.mock.calls)).toStrictEqual([1, 1, 1]);

    itemRenderer.mockReset();
    fireEvent.keyDown(group, {
      key: 'ArrowLeft',
      which: 37,
    });

    expect(getThirdArguments(itemRenderer.mock.calls)).toStrictEqual([0, 0, 0]);

    itemRenderer.mockReset();
    fireEvent.keyDown(group, {
      key: 'ArrowDown',
      which: 40,
    });

    expect(getThirdArguments(itemRenderer.mock.calls)).toStrictEqual([2, 2, 2]);

    itemRenderer.mockReset();
    fireEvent.keyDown(group, {
      key: 'ArrowUp',
      which: 38,
    });

    expect(getThirdArguments(itemRenderer.mock.calls)).toStrictEqual([0, 0, 0]);
  });
});
