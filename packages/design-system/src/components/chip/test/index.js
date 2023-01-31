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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import Chip from '../chip';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('Chip', () => {
  const chipText = 'Some chip text';
  const onClick = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('should render a default button as a chip', () => {
    renderWithProviders(<Chip>{chipText}</Chip>);
    expect(screen.getByRole('button')).toHaveTextContent(chipText);
  });

  it('should render the prefix components', () => {
    renderWithProviders(
      <Chip prefix={<div data-testid="test-prefix" />}>{chipText}</Chip>
    );
    expect(screen.getByTestId('test-prefix')).toBeInTheDocument();
  });

  it('should render the suffix components', () => {
    renderWithProviders(
      <Chip prefix={<div data-testid="test-suffix" />}>{chipText}</Chip>
    );
    expect(screen.getByTestId('test-suffix')).toBeInTheDocument();
  });

  it('should simulate a click on <Chip />', () => {
    renderWithProviders(<Chip onClick={onClick}>{chipText}</Chip>);
    const chip = screen.getByText(chipText);
    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('should not trigger a click on <Chip /> when disabled', () => {
    renderWithProviders(
      <Chip disabled onClick={onClick}>
        {chipText}
      </Chip>
    );
    const chip = screen.getByText(chipText);
    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
