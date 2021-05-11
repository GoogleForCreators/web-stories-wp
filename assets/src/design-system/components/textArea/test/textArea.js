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
import { TextArea } from '..';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('TextArea', () => {
  const defaultProps = {
    value: '',
    onChange: () => {},
  };

  it('should render the textarea', () => {
    renderWithProviders(
      <TextArea
        {...defaultProps}
        aria-label="test"
        placeholder="my placeholder"
      />
    );

    expect(screen.getByPlaceholderText('my placeholder')).toBeInTheDocument();
  });

  it('should render a label', () => {
    renderWithProviders(
      <TextArea {...defaultProps} label="This is my input label" />
    );

    expect(screen.getByText('This is my input label')).toBeInTheDocument();
  });

  it('should render a hint', () => {
    renderWithProviders(
      <TextArea
        {...defaultProps}
        aria-label="test"
        hint="This is my input hint"
      />
    );

    expect(screen.getByText('This is my input hint')).toBeInTheDocument();
  });

  it('should render the counter', () => {
    renderWithProviders(
      <TextArea
        {...defaultProps}
        aria-label="test"
        showCount
        maxLength={10}
        value="foo"
      />
    );

    expect(screen.getByText('3/10')).toBeInTheDocument();
  });
});
