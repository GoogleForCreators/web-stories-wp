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
import { useState } from 'react';
import { fireEvent } from '@testing-library/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { DIRECTION, SCALE_DIRECTION } from '../../../../../../animation';
import { renderWithTheme } from '../../../../../testUtils';
import { DirectionRadioInput } from '../directionRadioInput';

function DirectionRadioInputUncontrolled({ onChange, directions }) {
  const [state, setState] = useState(null);
  return (
    <DirectionRadioInput
      value={state}
      onChange={(e) => {
        setState(e.target.value);
        onChange(e);
      }}
      directions={directions}
    />
  );
}

DirectionRadioInputUncontrolled.propTypes = {
  onChange: PropTypes.func,
  directions: PropTypes.arrayOf(PropTypes.string),
};

describe('<DirectionRadioInput />', () => {
  it('should render', () => {
    const { getByRole } = renderWithTheme(<DirectionRadioInput />);
    const fieldset = getByRole('group');
    expect(fieldset).toBeInTheDocument();
  });

  it('should render directions supplied as radio inputs', () => {
    const { getAllByRole } = renderWithTheme(
      <DirectionRadioInput
        directions={[DIRECTION.TOP_TO_BOTTOM, DIRECTION.BOTTOM_TO_TOP]}
        onChange={() => {}}
      />
    );
    const radios = getAllByRole('radio');
    expect(radios).toHaveLength(2);
  });

  it('should call onChange when radio input clicked', () => {
    const onChange = jest.fn((e) => e.target.value);
    const directions = [DIRECTION.TOP_TO_BOTTOM, DIRECTION.BOTTOM_TO_TOP];
    const { getAllByRole } = renderWithTheme(
      <DirectionRadioInput onChange={onChange} directions={directions} />
    );

    const radios = getAllByRole('radio');
    fireEvent(
      radios[1],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveReturnedWith(directions[1]);
  });

  it('should update checked when new input clicked', () => {
    const onChange = jest.fn();
    const { getAllByRole, getByRole } = renderWithTheme(
      <DirectionRadioInputUncontrolled
        onChange={onChange}
        directions={[DIRECTION.TOP_TO_BOTTOM, DIRECTION.BOTTOM_TO_TOP]}
      />
    );

    const radios = getAllByRole('radio');

    fireEvent(
      radios[1],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(getByRole('radio', { checked: true })).toBe(radios[1]);

    fireEvent(
      radios[0],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(getByRole('radio', { checked: true })).toBe(radios[0]);
  });

  it('should render the correct number of arrows for scale direction', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <DirectionRadioInputUncontrolled
        onChange={onChange}
        directions={[SCALE_DIRECTION.SCALE_IN, SCALE_DIRECTION.SCALE_OUT]}
      />
    );

    const radios = getAllByRole('radio');

    expect(radios).toHaveLength(4);
  });
});
