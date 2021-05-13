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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Input } from '..';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { noop } from '../../../utils';

describe('Input', () => {
  it('should render the input', () => {
    renderWithProviders(
      <Input
        aria-label="test"
        placeholder="my placeholder"
        value=""
        onChange={noop}
      />
    );

    expect(screen.getByPlaceholderText('my placeholder')).toBeInTheDocument();
  });

  it('should render a label', () => {
    renderWithProviders(
      <Input label="This is my input label" value="" onChange={noop} />
    );

    expect(screen.getByText('This is my input label')).toBeInTheDocument();
  });

  it('should render a hint', () => {
    renderWithProviders(
      <Input
        aria-label="test"
        hint="This is my input hint"
        value=""
        onChange={noop}
      />
    );

    expect(screen.getByText('This is my input hint')).toBeInTheDocument();
  });

  it('should render a suffix', () => {
    renderWithProviders(
      <Input aria-label="test" suffix="suffix" value="" onChange={noop} />
    );

    const suffixElement = screen.getByText('suffix');

    expect(suffixElement).toBeInTheDocument();
  });
});
