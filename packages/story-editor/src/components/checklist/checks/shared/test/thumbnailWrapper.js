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
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme as dsTheme } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { ThumbnailWrapper } from '..';
import { MAX_THUMBNAILS_DISPLAYED } from '../../../../checklistCard';

const Wrapper = ({ children }) => (
  <ThemeProvider theme={dsTheme}>{children}</ThemeProvider>
);

describe('ThumbnailWrapper', () => {
  it('should not show the `expand` when there are zero children', () => {
    render(<ThumbnailWrapper />, { wrapper: Wrapper });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should not show the `expand` when there is one child', () => {
    render(
      <ThumbnailWrapper>
        <div />
      </ThumbnailWrapper>,
      { wrapper: Wrapper }
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it(`should not show the 'expand' button when there are less than ${MAX_THUMBNAILS_DISPLAYED} children`, () => {
    render(
      <ThumbnailWrapper>{[<div key={1} />, <div key={2} />]}</ThumbnailWrapper>,
      { wrapper: Wrapper }
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it(`should not show the 'expand' button when there are less than ${
    MAX_THUMBNAILS_DISPLAYED + 2
  } children`, () => {
    const children = [...Array(MAX_THUMBNAILS_DISPLAYED + 2).keys()].map(
      (_, index) => <div key={index} /> // eslint-disable-line react/no-array-index-key
    );

    render(<ThumbnailWrapper>{children}</ThumbnailWrapper>, {
      wrapper: Wrapper,
    });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
