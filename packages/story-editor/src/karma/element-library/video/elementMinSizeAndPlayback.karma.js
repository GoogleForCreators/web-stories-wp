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
 * Internal dependencies
 */
import { Fixture } from '../..';
import { useInsertElement } from '../../../components/canvas';

describe('Element min size and playback', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render ok', () => {
    expect(
      fixture.container.querySelector('[data-testid="fullbleed"]')
    ).toBeTruthy();
  });

  describe('add 2 videos', () => {
    let video1;
    let video2;
    let video1Frame;

    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const videoProps = {
        x: 0,
        y: 0,
        width: 260,
        height: 120,
        resource: {
          type: 'video',
          mimeType: 'video/ogg',
          src: 'http://localhost:9876/__static__/asteroid.ogg',
          poster: 'http://localhost:9876/__static__/asteroid.png',
          width: 1080,
          height: 720,
          alt: 'Asteroid',
        },
      };
      video1 = await fixture.act(() => insertElement('video', videoProps));
      // fix flaky tests
      await fixture.events.sleep();
      video2 = await fixture.act(() =>
        insertElement('video', { ...videoProps, x: 20, y: 20 })
      );
      video1Frame = fixture.querySelector(
        `[data-element-id="${video1.id}"][data-testid="frameElement"]`
      );
    });

    it('hit play button on the covered element', async () => {
      // video1 is covered by video2
      // select video1, hover on play button, hit play, verify that it's playing
      const video1bb = video1Frame.getBoundingClientRect();

      await fixture.events.mouse.click(video1bb.x, video1bb.y);

      await fixture.events.mouse.click(
        video1bb.x + video1bb.width / 2,
        video1bb.y + video1bb.height / 2
      );
      const video1El = fixture.querySelector(`#video-${video1.id}`);
      const video2El = fixture.querySelector(`#video-${video2.id}`);
      const video1isPlaying = video1El.paused === false;
      const video2isPlaying = video2El.paused === false;

      expect(video1isPlaying).toBe(true);
      expect(video2isPlaying).toBe(false);
    });

    it('hit spacebar on the covered element', async () => {
      // video1 is covered by video2
      // select video1, press spacebar, verify video1 is playing
      const video1bb = video1Frame.getBoundingClientRect();

      await fixture.events.mouse.click(video1bb.x, video1bb.y);

      await fixture.events.keyboard.press('Space');
      const video1El = fixture.querySelector(`#video-${video1.id}`);
      const video2El = fixture.querySelector(`#video-${video2.id}`);
      const video1isPlaying = video1El.paused === false;
      const video2isPlaying = video2El.paused === false;

      expect(video1isPlaying).toBe(true);
      expect(video2isPlaying).toBe(false);
    });
  });
});
