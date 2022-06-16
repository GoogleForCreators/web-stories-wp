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
import { renderHook, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { MEDIA_VIDEO_MINIMUM_DURATION } from '../../../constants';
import useVideoNode from '../useVideoNode';

function setup(videoData = {}) {
  return renderHook(() => useVideoNode({ start: 0, end: null, ...videoData }));
}

function loadVideo(result, duration) {
  const videoNode = new DummyVideo();
  act(() => {
    result.current.setVideoNode(videoNode);
  });
  act(() => {
    videoNode.loadedmetadata({ target: { duration } });
  });
  return videoNode;
}

describe('useVideoNode', () => {
  it('should initially be empty when no video has loaded', () => {
    const { result } = setup();

    expect(result.current.hasChanged).toBe(false);
    expect(result.current.startOffset).toBeNull();
    expect(result.current.endOffset).toBeNull();
    expect(result.current.maxOffset).toBeNull();
  });

  it('should set offsets when video has loaded', () => {
    const { result } = setup();

    const videoNode = loadVideo(result, 10);

    // Expect offsets to have been set:
    expect(result.current.hasChanged).toBe(false);
    expect(result.current.startOffset).toBe(0);
    expect(result.current.endOffset).toBe(10000);
    expect(result.current.maxOffset).toBe(10000);

    // Expect video to be playing from 0 second on
    expect(videoNode.playing).toBe(true);
    expect(videoNode.currentTime).toBe(0);
  });

  it('should set offsets from video data when video has loaded', () => {
    const { result } = setup({ start: 1000, end: 9000 });

    const videoNode = loadVideo(result, 10);

    // Expect offsets to have been set:
    expect(result.current.hasChanged).toBe(false);
    expect(result.current.startOffset).toBe(1000);
    expect(result.current.endOffset).toBe(9000);
    expect(result.current.maxOffset).toBe(10000);

    // Expect video to be playing from 1 second on
    expect(videoNode.playing).toBe(true);
    expect(videoNode.currentTime).toBe(1);
  });

  it('should update current time and loop correctly', () => {
    const { result } = setup({ start: 1000 });

    const videoNode = loadVideo(result, 10);

    // Expect currentTime to be initial
    expect(result.current.currentTime).toBe(1000);

    // Forward playhead to 2s
    videoNode.setCurrentTime(2);

    // Expect currentTime to be updated
    expect(result.current.currentTime).toBe(2000);

    // Forward playhead to 11s, which is beyond the end
    videoNode.setCurrentTime(11);

    // Expect currentTime in hook to be at end
    expect(result.current.currentTime).toBe(10000);

    // But expect video node to have been looped back to start
    expect(videoNode.currentTime).toBe(1);

    // Set start offset to 2000
    act(() => result.current.setStartOffset(2000));

    // Expect video node to be set to new offset
    expect(videoNode.currentTime).toBe(2);

    // Set end offset to 8000
    act(() => result.current.setEndOffset(8000));

    // Expect video node to be set to new offset
    expect(videoNode.currentTime).toBe(8);

    // Forward playhead to 9s, which is before the real end but after current end offset
    videoNode.setCurrentTime(9);

    // Expect currentTime in hook to be at end
    expect(result.current.currentTime).toBe(8000);

    // But expect video node to have been looped back to the new start offset
    expect(videoNode.currentTime).toBe(2);
  });

  it('should update hasChanged flag correctly', () => {
    const { result } = setup({ start: 1000 });

    loadVideo(result, 10);

    // Expect currentTime to be initial
    expect(result.current.hasChanged).toBe(false);

    /// Set start offset to 2000
    act(() => result.current.setStartOffset(2000));

    // Expect hasChanged to be true
    expect(result.current.hasChanged).toBe(true);

    /// Set start offset back to 1000
    act(() => result.current.setStartOffset(1000));

    // Expect hasChanged to be back at false
    expect(result.current.hasChanged).toBe(false);

    // Set end offset to 8000
    act(() => result.current.setEndOffset(8000));

    // Expect hasChanged to be true again
    expect(result.current.hasChanged).toBe(true);
  });

  it('should enforce minimum video duration', () => {
    const { result } = setup({ start: 1000 });

    loadVideo(result, 10);

    /// Set start and end offset to the same value
    // Note, this must be done in two separate act()'s!
    act(() => result.current.setStartOffset(5000));
    act(() => result.current.setEndOffset(5000));

    // Expect start offset to be correct, but end offset to be min duration off
    expect(result.current.startOffset).toBe(5000);
    expect(result.current.endOffset).toBe(5000 + MEDIA_VIDEO_MINIMUM_DURATION);
  });
});

function DummyVideo() {
  this.currentTime = 0;
  this.playing = false;
  this.play = () => {
    this.playing = true;
  };
  this.addEventListener = (event, callback) => {
    this[event] = callback;
  };
  this.removeEventListener = () => {};
  this.setCurrentTime = (newCurrentTime) => {
    this.currentTime = newCurrentTime;
    act(() => this.timeupdate({ target: this }));
  };
}
