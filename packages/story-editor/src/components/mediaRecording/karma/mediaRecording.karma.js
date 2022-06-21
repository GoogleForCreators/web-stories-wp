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
import { preloadVideo } from '@googleforcreators/media';
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { COUNTDOWN_TIME_IN_SECONDS } from '../constants';

const mediaDevices = [
  {
    kind: 'videoinput',
    deviceId: 'video-a',
    label: 'Video Device A',
  },
  {
    kind: 'videoinput',
    deviceId: 'video-b',
    label: 'Video Device B',
  },
  {
    kind: 'videoinput',
    deviceId: 'video-c',
    label: 'Video Device C',
  },
  {
    kind: 'audioinput',
    deviceId: 'audio-a',
    label: 'Audio Device A',
  },
  {
    kind: 'audioinput',
    deviceId: 'audio-b',
    label: 'Audio Device B',
  },
  {
    kind: 'audioinput',
    deviceId: 'audio-c',
    label: 'Audio Device C',
  },
];

describe('Media Recording', () => {
  let fixture;

  beforeEach(async () => {
    const video = await preloadVideo(
      'http://localhost:9876/__static__/beach.webm'
    );
    video.loop = true;
    try {
      await video.play();
    } catch {
      // Do nothing.
    }
    const videoStream = video.captureStream();
    spyOn(navigator.mediaDevices, 'getUserMedia').and.resolveTo(videoStream);
    spyOn(navigator.mediaDevices, 'enumerateDevices').and.resolveTo(
      mediaDevices
    );

    spyOnProperty(window, 'crossOriginIsolated', 'get').and.returnValue(true);

    fixture = new Fixture();
    fixture.setFlags({
      mediaRecording: true,
    });

    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  describe('Creator can self-record using their webcam', () => {
    it('should toggle media recording layer via library and quick actions', async () => {
      // Open media recording.
      await fixture.events.click(fixture.editor.library.media.mediaRecording);
      expect(
        fixture.editor.canvas.mediaRecordingLayer.recordVideo
      ).not.toBeNull();

      // Close it again.
      await fixture.events.click(fixture.editor.library.media.mediaRecording);

      await expect(
        fixture.screen.queryByRole('region', {
          name: /^Media Recording layer$/i,
        })
      ).toBeNull();

      // Open it again.
      await fixture.events.click(fixture.editor.library.media.mediaRecording);

      expect(
        fixture.editor.canvas.mediaRecordingLayer.recordVideo
      ).not.toBeNull();

      // Now close it via quick actions.
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.closeButton
      );

      await expect(
        fixture.screen.queryByRole('region', {
          name: /^Media Recording layer$/i,
        })
      ).toBeNull();
    });

    it('should record a video', async () => {
      await fixture.events.click(fixture.editor.library.media.mediaRecording);
      await waitFor(() => {
        expect(fixture.editor.canvas.mediaRecordingLayer).not.toBeNull();
      });
      expect(
        fixture.editor.canvas.mediaRecordingLayer.recordVideo
      ).not.toBeNull();
      expect(
        fixture.editor.canvas.mediaRecordingLayer.takePhoto
      ).not.toBeNull();

      await fixture.snapshot();

      await fixture.events.click(
        fixture.editor.canvas.mediaRecordingLayer.recordVideo
      );

      expect(
        fixture.editor.canvas.quickActionMenu.optionsButton.disabled
      ).toBeTrue();

      await fixture.events.sleep((COUNTDOWN_TIME_IN_SECONDS + 1) * 1000);

      expect(
        fixture.editor.canvas.mediaRecordingLayer.stopRecording
      ).not.toBeNull();

      await fixture.events.click(
        fixture.editor.canvas.mediaRecordingLayer.stopRecording
      );

      expect(fixture.editor.canvas.mediaRecordingLayer.retry).not.toBeNull();
      expect(fixture.editor.canvas.mediaRecordingLayer.insert).not.toBeNull();

      await fixture.events.click(
        fixture.editor.canvas.mediaRecordingLayer.retry
      );

      expect(
        fixture.editor.canvas.mediaRecordingLayer.recordVideo
      ).not.toBeNull();
      expect(
        fixture.editor.canvas.mediaRecordingLayer.takePhoto
      ).not.toBeNull();
    });

    it('should take a photo', async () => {
      await fixture.events.click(fixture.editor.library.media.mediaRecording);
      await waitFor(() => {
        expect(fixture.editor.canvas.mediaRecordingLayer).not.toBeNull();
      });

      await fixture.events.click(
        fixture.editor.canvas.mediaRecordingLayer.takePhoto
      );

      await fixture.events.sleep((COUNTDOWN_TIME_IN_SECONDS + 1) * 1000);

      expect(
        fixture.editor.canvas.mediaRecordingLayer.previewImage
      ).not.toBeNull();
    });
  });
});
