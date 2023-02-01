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
import { render, screen, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import EmbedPlaceholder from '../embedPlaceholder';

describe('EmbedPlaceholder', () => {
  it('should display the embed placeholder', () => {
    const onSubmit = jest.fn();
    render(
      <EmbedPlaceholder
        icon={null}
        label="Embed Placeholder"
        value=""
        onSubmit={onSubmit}
        cannotEmbed={false}
      />
    );
    expect(screen.getByText('Embed Placeholder')).toBeInTheDocument();
    expect(screen.getByText('Select Story')).toBeInTheDocument();
    expect(screen.getByText('Insert from URL')).toBeInTheDocument();
  });

  it('should trigger onSubmit callback when submitting the form', () => {
    const onSubmit = jest.fn();
    render(
      <EmbedPlaceholder
        icon={null}
        label="Embed Placeholder"
        value="https://example.com"
        onSubmit={onSubmit}
        cannotEmbed={false}
      />
    );
    fireEvent.click(screen.getByText('Replace URL'));
    fireEvent.submit(screen.getByTestId('embed-placeholder-form'));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('should display a message if embedding is not possible', () => {
    const onSubmit = jest.fn();
    render(
      <EmbedPlaceholder
        icon={null}
        label="Embed Placeholder"
        value="https://example.com"
        onSubmit={onSubmit}
        cannotEmbed
      />
    );
    expect(
      screen.getByText('Sorry, this content could not be embedded.')
    ).toBeInTheDocument();
  });
});
