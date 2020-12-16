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
import {
  ANIMATION_EFFECTS,
  DIRECTION,
  SCALE_DIRECTION,
} from '../../../../../../animation';
import { renderWithTheme } from '../../../../../testUtils';
import EffectChooser from '../effectChooser';

describe('<EffectChooser />', function () {
  it('should return an effect object when clicked.', function () {
    const onAnimationSelected = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <EffectChooser onAnimationSelected={onAnimationSelected} />
    );

    fireEvent.click(getByLabelText('Drop Effect'));

    expect(onAnimationSelected).toHaveBeenCalledWith({
      animation: ANIMATION_EFFECTS.DROP.value,
    });
  });

  it('should return an effect object with direction when clicked.', function () {
    const onAnimationSelected = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <EffectChooser onAnimationSelected={onAnimationSelected} />
    );

    fireEvent.click(getByLabelText('Fly In from Left Effect'));

    expect(onAnimationSelected).toHaveBeenCalledWith({
      animation: ANIMATION_EFFECTS.FLY_IN.value,
      flyInDir: DIRECTION.LEFT_TO_RIGHT,
    });
  });

  it('should return an effect object with rotation when clicked.', function () {
    const onAnimationSelected = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <EffectChooser onAnimationSelected={onAnimationSelected} />
    );

    fireEvent.click(getByLabelText('Rotate In Left Effect'));

    expect(onAnimationSelected).toHaveBeenCalledWith({
      animation: ANIMATION_EFFECTS.ROTATE_IN.value,
      rotateInDir: DIRECTION.LEFT_TO_RIGHT,
    });
  });

  it('should return an effect object with defaultValue when clicked.', function () {
    const onAnimationSelected = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <EffectChooser onAnimationSelected={onAnimationSelected} />
    );

    fireEvent.click(getByLabelText('Scale In Effect'));

    expect(onAnimationSelected).toHaveBeenCalledWith({
      animation: ANIMATION_EFFECTS.ZOOM.value,
      scaleDirection: SCALE_DIRECTION.SCALE_IN,
    });
  });
});
