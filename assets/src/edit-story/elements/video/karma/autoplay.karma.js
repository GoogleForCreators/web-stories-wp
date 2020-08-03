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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { getBackgroundElementId } from '../../../components/dropTargets/karma/background.karma';

describe('Autoplay video', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render ok', () => {
    expect(
      fixture.container.querySelector('[data-testid="fullbleed"]')
    ).toBeTruthy();
  });

  it('should autoplay on insert and on drop', async () => {
    // TODO: Switch to role selector after they are merged
    const videoFilter = fixture.screen.getByText('Video', {
      exact: true,
      selector: 'button',
    });
    await fixture.events.mouse.clickOn(videoFilter);
    const video = fixture.screen.getAllByLabelText('ranger9', {
      selector: 'video',
    });
    await fixture.events.mouse.clickOn(video[0]);
    const frames = fixture.screen.getAllByTestId('frameElement');
    const videoFrame = frames[1];
    const videoId = videoFrame.dataset.elementId;
    const video1El = fixture.querySelector(`#video-${videoId}`);
    expect(video1El.paused).toBe(false);

    const safezone = fixture.screen.getAllByTestId('safezone')[0];
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(videoFrame, '10%', '10%', { steps: 12 }),
      down(),
      moveRel(safezone, 10, 10, { steps: 12 }),
      up(),
    ]);
    // should not play during the drag
    expect(video1El.paused).toBe(true);
    await fixture.events.mouse.up();
    const backgroundId = await getBackgroundElementId(fixture);
    const backgroundElVideo = fixture.querySelector(`#video-${backgroundId}`);
    expect(backgroundElVideo.paused).toBe(false);

    // Bug #2618 coverage
    const backgroundEl = fixture.querySelector(
      `[data-testid="safezone"] [data-element-id="${backgroundId}"]`
    );
    await fixture.events.mouse.seq(({ moveRel }) => [
      moveRel(backgroundEl, '10%', '10%'),
    ]);
    await waitFor(() =>
      fixture.screen.getByRole('button', { name: 'Click to pause' })
    );
    const pauseButton = fixture.screen.getByRole('button', {
      name: 'Click to pause',
    });
    await fixture.events.click(pauseButton);
    expect(backgroundElVideo.paused).toBe(true);
    const playButton = fixture.screen.getByRole('button', {
      name: 'Click to play',
    });
    await fixture.events.click(playButton);
    expect(backgroundElVideo.paused).toBe(false);
  });
});
