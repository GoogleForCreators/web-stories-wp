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
import React from 'react';
import { act, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import AnimationTimeline from '..';
import { renderWithTheme } from '../../../testUtils';

const animations = Array.from(Array(10).keys()).reduce((acc, id) => {
  acc[id] = {
    id,
    duration: 500,
    delay: id % 2 ? 100 : 0,
    label: `Animation ${id}`,
  };
  return acc;
}, {});

describe('<AnimationTimeline />', function () {
  it('should generate the number of rows for animations provided.', function () {
    const { queryAllByTestId } = renderWithTheme(
      <AnimationTimeline
        animations={Object.values(animations)}
        duration={6000}
        onUpdateAnimation={() => {}}
      />
    );
    expect(queryAllByTestId('timeline-animation-item')).toHaveLength(
      Object.values(animations).length
    );
  });

  it('should update the duration when the end timing bar is adjusted to the right', function () {
    const updaterFn = jest.fn();
    const { getByTestId } = renderWithTheme(
      <AnimationTimeline
        animations={Object.values(animations)}
        duration={6000}
        onUpdateAnimation={updaterFn}
      />
    );

    const endHandle = getByTestId('end-animation-handle-Animation 0');
    endHandle.focus();

    act(() => {
      fireEvent.keyDown(endHandle, {
        key: 'ArrowRight',
        which: 39,
      });
    });

    /**
     * Starting duration was 500ms, one right key press moves 100ms,
     * so the new duration should be 600ms.
     */
    expect(updaterFn).toHaveBeenCalledWith(
      { duration: 500, id: 0, label: 'Animation 0', delay: 0 },
      { duration: 600, delay: 0 }
    );
  });

  it('should update the duration when the end timing bar is adjusted to the left', function () {
    const updaterFn = jest.fn();
    const { getByTestId } = renderWithTheme(
      <AnimationTimeline
        animations={Object.values(animations)}
        duration={6000}
        onUpdateAnimation={updaterFn}
      />
    );

    const endHandle = getByTestId('end-animation-handle-Animation 0');
    endHandle.focus();

    act(() => {
      fireEvent.keyDown(endHandle, {
        key: 'ArrowLeft',
        which: 37,
      });
    });

    /**
     * Starting duration was 500ms, one left key press moves -100ms,
     * so the new duration should be 400ms.
     */
    expect(updaterFn).toHaveBeenCalledWith(
      { duration: 500, id: 0, label: 'Animation 0', delay: 0 },
      { duration: 400, delay: 0 }
    );
  });

  it('should update the delay and duration when the start timing bar is adjusted to the left', function () {
    const updaterFn = jest.fn();
    const { getByTestId } = renderWithTheme(
      <AnimationTimeline
        animations={Object.values(animations)}
        duration={6000}
        onUpdateAnimation={updaterFn}
      />
    );

    const startHandle = getByTestId('start-animation-handle-Animation 1');
    startHandle.focus();

    act(() => {
      fireEvent.keyDown(startHandle, {
        key: 'ArrowLeft',
        which: 37,
      });
    });

    /**
     * Starting duration was 500ms with a 100ms, one left key press moves -100ms,
     * so the new duration should be 600ms with an delay of 0s.
     */
    expect(updaterFn).toHaveBeenCalledWith(
      { duration: 500, id: 1, label: 'Animation 1', delay: 100 },
      { duration: 600, delay: 0 }
    );
  });

  it('should update the delay and duration when the start timing bar is adjusted to the right', function () {
    const updaterFn = jest.fn();
    const { getByTestId } = renderWithTheme(
      <AnimationTimeline
        animations={Object.values(animations)}
        duration={6000}
        onUpdateAnimation={updaterFn}
      />
    );

    const startHandle = getByTestId('start-animation-handle-Animation 1');
    startHandle.focus();

    act(() => {
      fireEvent.keyDown(startHandle, {
        key: 'ArrowRight',
        which: 39,
      });
    });

    /**
     * Starting duration was 500ms with a 100ms, one right key press moves 100ms,
     * so the new duration should be 400ms with an delay of 200ms.
     */
    expect(updaterFn).toHaveBeenCalledWith(
      { duration: 500, id: 1, label: 'Animation 1', delay: 100 },
      { duration: 400, delay: 200 }
    );
  });

  it('should update the delay when the location timing bar is adjusted to the right', function () {
    const updaterFn = jest.fn();
    const { getByTestId } = renderWithTheme(
      <AnimationTimeline
        animations={Object.values(animations)}
        duration={6000}
        onUpdateAnimation={updaterFn}
      />
    );

    const startHandle = getByTestId('location-animation-handle-Animation 1');
    startHandle.focus();

    act(() => {
      fireEvent.keyDown(startHandle, {
        key: 'ArrowRight',
        which: 39,
      });
    });

    /**
     * Starting duration was 500ms with a 100ms, one right key press moves 100ms,
     * so the new duration should be 500ms with an delay of 200ms.
     */
    expect(updaterFn).toHaveBeenCalledWith(
      { duration: 500, id: 1, label: 'Animation 1', delay: 100 },
      { duration: 500, delay: 200 }
    );
  });

  it('should update the delay when the location timing bar is adjusted to the left', function () {
    const updaterFn = jest.fn();
    const { getByTestId } = renderWithTheme(
      <AnimationTimeline
        animations={Object.values(animations)}
        duration={6000}
        onUpdateAnimation={updaterFn}
      />
    );

    const startHandle = getByTestId('location-animation-handle-Animation 1');
    startHandle.focus();

    act(() => {
      fireEvent.keyDown(startHandle, {
        key: 'ArrowLeft',
        which: 37,
      });
    });

    /**
     * Starting duration was 500ms with a 100ms, one right key press moves 100ms,
     * so the new duration should be 500ms with an delay of 0s.
     */
    expect(updaterFn).toHaveBeenCalledWith(
      { duration: 500, id: 1, label: 'Animation 1', delay: 100 },
      { duration: 500, delay: 0 }
    );
  });
});
