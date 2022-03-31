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
import { useState } from '@googleforcreators/react';
import { fireEvent, screen } from '@testing-library/react';
import PropTypes from 'prop-types';
import { DIRECTION, SCALE_DIRECTION } from '@googleforcreators/animation';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
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
    renderWithTheme(<DirectionRadioInput />);
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();
  });

  it('should render directions supplied as buttons', () => {
    renderWithTheme(
      <DirectionRadioInput
        directions={[DIRECTION.TOP_TO_BOTTOM, DIRECTION.BOTTOM_TO_TOP]}
        onChange={() => {}}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('should call onChange when button clicked', () => {
    const onChange = jest.fn((value) => value);
    const directions = [DIRECTION.TOP_TO_BOTTOM, DIRECTION.BOTTOM_TO_TOP];
    renderWithTheme(
      <DirectionRadioInput onChange={onChange} directions={directions} />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(directions[1]);
  });

  it('should render the correct number of arrows for scale direction', () => {
    const onChange = jest.fn();
    renderWithTheme(
      <DirectionRadioInputUncontrolled
        onChange={onChange}
        directions={[SCALE_DIRECTION.SCALE_IN, SCALE_DIRECTION.SCALE_OUT]}
      />
    );

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(4);
  });
});
