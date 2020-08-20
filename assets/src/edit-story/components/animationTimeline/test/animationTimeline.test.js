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
    offset: id % 2 ? 100 : 0,
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

  it('should update the offset when a timing bar is adjusted to the right', function () {
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
      { duration: 500, id: 0, label: 'Animation 0', offset: 0 },
      { duration: 600, offset: 0 }
    );
  });

  it('should update the offset when a timing bar is adjusted to the left', function () {
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
      { duration: 500, id: 0, label: 'Animation 0', offset: 0 },
      { duration: 400, offset: 0 }
    );
  });
});
