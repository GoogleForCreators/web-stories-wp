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
  let mediaPane;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    mediaPane = fixture.container.querySelector('#library-pane-media');
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
    const allFilter = Array.from(mediaPane.querySelectorAll('span')).find(
      (el) => el.textContent === 'All Types'
    );
    await fixture.events.mouse.clickOn(allFilter);
    const videoFilter = document.querySelector('#dropDown-video');
    await fixture.events.mouse.clickOn(videoFilter);
    const video = Array.from(mediaPane.querySelectorAll('video')).filter(
      (el) => el.ariaLabel === 'ranger9'
    );
    await fixture.events.mouse.clickOn(video[0]);

    const videoFrame = fixture.editor.canvas.framesLayer.frames[1].node;
    const videoId = videoFrame.dataset.elementId;

    const video1El = fixture.editor.canvas.displayLayer
      .display(videoId)
      .node.querySelector('video');
    expect(video1El.paused).toBe(false);

    const fullbleed = fixture.editor.canvas.fullbleed.container;
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(videoFrame, '10%', '10%'),
      down(),
      moveRel(fullbleed, 10, 10),
      up(),
    ]);
    // Should not play during the drag
    expect(video1El.paused).toBe(true);
    await fixture.events.mouse.up();
    const backgroundId = await getBackgroundElementId(fixture);
    const backgroundElVideo = fixture.editor.canvas.displayLayer
      .display(backgroundId)
      .node.querySelector('video');
    expect(backgroundElVideo.paused).toBe(false);

    // Bug #2618 coverage
    await fixture.events.mouse.seq(({ moveRel }) => [
      moveRel(fullbleed, '10%', '10%'),
    ]);
    await waitFor(
      () => fixture.editor.canvas.framesLayer.controls(backgroundId).pause
    );
    await fixture.events.click(
      fixture.editor.canvas.framesLayer.controls(backgroundId).pause
    );
    expect(backgroundElVideo.paused).toBe(true);
    await fixture.events.click(
      fixture.editor.canvas.framesLayer.controls(backgroundId).play
    );
    expect(backgroundElVideo.paused).toBe(false);
  });
});
