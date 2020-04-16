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
import { waitFor, fireEvent, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import createSolid from '../../../../utils/createSolid';
import { arrange } from './_utils';

describe('<ColorPicker /> as the footer is interacted with', () => {
  it('should set hex when edited and invoke onChange', async () => {
    const { getEditableHexElement, onChange } = arrange({
      color: createSolid(0, 0, 255),
      hasGradient: true,
    });

    // At first it's a button
    const initialButton = getEditableHexElement();
    expect(initialButton).toHaveTextContent(/#0000ff/i);
    fireEvent.click(initialButton);

    // When clicked, it's an input
    const input = getEditableHexElement();
    expect(input).toHaveValue('0000FF'); // toHaveValue doesn't support regex
    await waitFor(() => expect(input).toHaveFocus());
    fireEvent.change(input, { target: { value: 'ff00ff' } });

    // Press esc to abort editing
    fireEvent.keyDown(input, { key: 'Escape', which: 27 });

    // It's the button again
    await waitFor(() =>
      expect(getEditableHexElement()).toHaveTextContent(/#ff00ff/i)
    );

    expect(onChange).toHaveBeenCalledWith(createSolid(255, 0, 255));
  });

  it('should set opacity when edited and invoke onChange', async () => {
    const { getEditableAlphaElement, getSolidButton, onChange } = arrange({
      color: createSolid(0, 0, 255, 0.4),
      hasGradient: true,
    });

    // At first it's a button
    const initialButton = getEditableAlphaElement();
    expect(initialButton).toHaveTextContent(/40%/i);
    fireEvent.click(initialButton);

    // When clicked, it's an input
    const input = getEditableAlphaElement();
    expect(input).toHaveValue('40');
    await waitFor(() => expect(input).toHaveFocus());
    fireEvent.change(input, { target: { value: '70' } });

    // focus solid button in order to blur and thus abort editin
    // NB: has to be done with `act` rather than `fireEvent.focus` due to
    // https://github.com/testing-library/react-testing-library/issues/376
    act(() => getSolidButton().focus());

    // It's the button again
    await waitFor(() =>
      expect(getEditableAlphaElement()).toHaveTextContent(/70%/i)
    );

    expect(onChange).toHaveBeenCalledWith(createSolid(0, 0, 255, 0.7));
  });

  it('should set opacity to default when edited with illegal value and invoke onChange', async () => {
    const { getEditableAlphaElement, getSolidButton, onChange } = arrange({
      color: createSolid(0, 0, 255, 0.4),
      hasGradient: true,
    });

    // At first it's a button
    const initialButton = getEditableAlphaElement();
    fireEvent.click(initialButton);

    // When clicked, it's an input
    const input = getEditableAlphaElement();
    await waitFor(() => expect(input).toHaveFocus());
    fireEvent.change(input, { target: { value: 'ten' } });

    // focus solid button in order to blur and thus abort editin
    // NB: has to be done with `act` rather than `fireEvent.focus` due to
    // https://github.com/testing-library/react-testing-library/issues/376
    act(() => getSolidButton().focus());

    // It's the button again
    await waitFor(() =>
      expect(getEditableAlphaElement()).toHaveTextContent(/100%/i)
    );

    expect(onChange).toHaveBeenCalledWith(createSolid(0, 0, 255, 1));
  });
});
