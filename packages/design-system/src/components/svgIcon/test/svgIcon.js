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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import SVGIcon from '../svgIcon';

describe('SVGIcon component', () => {
  it('renders without crashing', () => {
    renderWithProviders(
      <SVGIcon glyph="test-glyph" viewBox="0 0 24 24" data-testid="svg-icon" />
    );
    expect(screen.getByTestId('svg-icon')).toBeInTheDocument();
  });

  it('applies the correct className', () => {
    renderWithProviders(
      <SVGIcon
        glyph="test-glyph"
        viewBox="0 0 24 24"
        className="test-class"
        data-testid="svg-icon"
      />
    );
    expect(screen.getByTestId('svg-icon')).toHaveClass('test-class');
  });

  it('sets the viewBox attribute correctly', () => {
    renderWithProviders(
      <SVGIcon glyph="test-glyph" viewBox="0 0 24 24" data-testid="svg-icon" />
    );
    expect(screen.getByTestId('svg-icon')).toHaveAttribute(
      'viewBox',
      '0 0 24 24'
    );
  });

  it('renders the title element when title is provided', () => {
    renderWithProviders(
      <SVGIcon glyph="test-glyph" viewBox="0 0 24 24" title="Test Title" />
    );
    expect(screen.getByTitle('Test Title')).toBeInTheDocument();
  });

  it('does not render the title element when title is not provided', () => {
    renderWithProviders(<SVGIcon glyph="test-glyph" viewBox="0 0 24 24" />);
    expect(screen.queryByTitle('')).not.toBeInTheDocument();
  });

  it('sets the xlink:href attribute correctly on the use element', () => {
    renderWithProviders(
      <SVGIcon glyph="test-glyph" viewBox="0 0 24 24" data-testid="svg-icon" />
    );
    const svgElement = screen.getByTestId('svg-icon');
    // There is no direct query for use elements.
    // eslint-disable-next-line testing-library/no-node-access
    const useElement = svgElement.querySelector('use');
    expect(useElement).toHaveAttribute('xlink:href', '#test-glyph');
  });

  it('passes additional props to the svg element', () => {
    renderWithProviders(
      <SVGIcon
        glyph="test-glyph"
        viewBox="0 0 24 24"
        data-testid="svg-icon"
        aria-label="icon"
      />
    );
    expect(screen.getByTestId('svg-icon')).toHaveAttribute(
      'aria-label',
      'icon'
    );
  });
});
