/*
 * Copyright 2021 Google LLC
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
import { Chip } from '..';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('Chip', () => {
  const chipText = 'Some chip text';
  const onClick = jest.fn();

  beforeEach(jest.clearAllMocks);
  it('should render a default button as a chip', () => {
    const { getByRole } = renderWithProviders(<Chip>{chipText}</Chip>);
    expect(getByRole('button')).toHaveTextContent(chipText);
  });
  it('should render the prefix components', () => {
    const { getByTestId } = renderWithProviders(
      <Chip prefix={<div data-testid="test-prefix" />}>{chipText}</Chip>
    );
    expect(getByTestId('test-prefix')).toBeInTheDocument();
  });
  it('should render the suffix components', () => {
    const { getByTestId } = renderWithProviders(
      <Chip prefix={<div data-testid="test-suffix" />}>{chipText}</Chip>
    );
    expect(getByTestId('test-suffix')).toBeInTheDocument();
  });

  it('should simulate a click on <Chip />', () => {
    const { getByText } = renderWithProviders(
      <Chip onClick={onClick}>{chipText}</Chip>
    );
    const chip = getByText(chipText);
    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('should not trigger a click on <Chip /> when disabled', () => {
    const { getByText } = renderWithProviders(
      <Chip disabled onClick={onClick}>
        {chipText}
      </Chip>
    );
    const chip = getByText(chipText);
    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
