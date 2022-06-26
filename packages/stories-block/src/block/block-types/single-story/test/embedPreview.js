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
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';

/**
 * Internal dependencies
 */
import EmbedPreview from '../embedPreview';

const url = 'https://wp.stories.google/stories/intro-to-web-stories-storytime';
const title = 'Stories in AMP';

jest.mock('../storyPlayer', () => {
  return {
    __esModule: true,
    //eslint-disable-next-line no-shadow
    default: function StoryPlayer({ url, title, onFocus }) {
      return (
        <a href={url} data-testid="amp-story-player" onFocus={onFocus}>
          {title}
        </a>
      );
    },
  };
});

describe('EmbedPreview', () => {
  it('should remove overlay on mouseup', () => {
    render(<EmbedPreview url={url} title={title} isSelected />);
    const overlay = screen.getByTestId('embed-preview-overlay');
    fireEvent.mouseUp(overlay);

    expect(
      screen.queryByTestId('embed-preview-overlay')
    ).not.toBeInTheDocument();
  });

  it('should add back overlay when block gets unselected', () => {
    const { rerender } = render(
      <EmbedPreview url={url} title={title} isSelected />
    );

    const overlay = screen.getByTestId('embed-preview-overlay');
    fireEvent.mouseUp(overlay);

    expect(
      screen.queryByTestId('embed-preview-overlay')
    ).not.toBeInTheDocument();

    rerender(<EmbedPreview url={url} title={title} isSelected={false} />);
    expect(screen.getByTestId('embed-preview-overlay')).toBeInTheDocument();
  });

  it('should remove overlay on player focus', async () => {
    render(<EmbedPreview url={url} title={title} isSelected />);
    const player = screen.getByTestId('amp-story-player');
    await act(() => {
      player.focus();
    });
    await waitFor(() =>
      expect(screen.getByTestId('amp-story-player')).toHaveFocus()
    );
    expect(
      screen.queryByTestId('embed-preview-overlay')
    ).not.toBeInTheDocument();
  });
});
