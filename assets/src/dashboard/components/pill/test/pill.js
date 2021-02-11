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
import { renderWithProviders } from '../../../testUtils/';
import Pill from '../';
import { PILL_LABEL_TYPES } from '../../../constants/components';

describe('Pill', () => {
  const pillText = 'text pill label';
  const onClickMock = jest.fn();

  it('should render default pill as checkbox', () => {
    const { getByRole, getByText } = renderWithProviders(
      <Pill onClick={onClickMock} name="test_pill" value="test">
        {pillText}
      </Pill>
    );
    expect(getByRole('checkbox')).toBeInTheDocument();
    expect(getByText(pillText)).toBeInTheDocument();
  });

  it('should render pill as radio input', () => {
    const { getByRole, getByText } = renderWithProviders(
      <Pill
        onClick={onClickMock}
        name="test_pill"
        value="test"
        inputType="radio"
      >
        {pillText}
      </Pill>
    );
    expect(getByRole('radio')).toBeInTheDocument();
    expect(getByText(pillText)).toBeInTheDocument();
  });

  it('should simulate a click on <Pill />', () => {
    const { getByRole } = renderWithProviders(
      <Pill
        onClick={onClickMock}
        name="test_pill"
        value="test"
        inputType="radio"
      >
        {pillText}
      </Pill>
    );

    const pill = getByRole('radio');

    fireEvent.click(pill);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it(`should render standard ${PILL_LABEL_TYPES.DEFAULT} pill label by default`, () => {
    const { getByTestId } = renderWithProviders(
      <Pill onClick={onClickMock} name="test_pill" value="test">
        {pillText}
      </Pill>
    );

    const label = getByTestId('default-pill-label');

    expect(label).toBeInTheDocument();
  });

  it(`should render standard ${PILL_LABEL_TYPES.SWATCH} pill label when labelType is 'swatch'`, () => {
    const { getByTestId } = renderWithProviders(
      <Pill
        onClick={onClickMock}
        name="test_pill"
        value="test"
        labelType={PILL_LABEL_TYPES.SWATCH}
      >
        {pillText}
      </Pill>
    );

    const label = getByTestId('swatch-pill-label');

    expect(label).toBeInTheDocument();
  });

  it(`should render standard ${PILL_LABEL_TYPES.FLOATING} pill label when labelType is 'FLOATING'`, () => {
    const { getByTestId } = renderWithProviders(
      <Pill
        onClick={onClickMock}
        name="test_pill"
        value="test"
        labelType={PILL_LABEL_TYPES.FLOATING}
      >
        {pillText}
      </Pill>
    );

    const label = getByTestId('floating-pill-label');

    expect(label).toBeInTheDocument();
  });
});
