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
import { renderHook } from '@testing-library/react-hooks';
/**
 * Internal dependencies
 */
import { createWrapperWithProps } from '../../../testUtils';
import StoryAnimation, { useStoryAnimationContext } from '..';

describe('StoryAnimation.Provider', () => {
  describe('getAnimationGenerators(target)', () => {
    it('calls all generators for a target', () => {
      const target = 'some-target';
      const animations = [
        { target, type: 'TYPE1' },
        { target, type: 'TYPE2' },
        { target: 'other-target', type: 'TYPE1' },
        { target: [target, 'other-target'], type: 'TYPE5' },
      ];

      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations,
        }),
      });

      const {
        state: { getAnimationGenerators },
      } = result.current;

      expect(getAnimationGenerators(target)).toHaveLength(3);
      expect(getAnimationGenerators('other-target')).toHaveLength(2);
      expect(getAnimationGenerators('not used target')).toHaveLength(0);
    });

    it('calls generators for a target in ascending order', () => {
      const target = 'some-target';
      const args = { someProp: 1 };
      const type = ['TYPE1', 'TYPE2', 'TYPE3'];
      const animations = [
        { target, type: type[0], ...args },
        { target, type: type[1], ...args },
        { target, type: type[2], ...args },
      ];

      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations,
        }),
      });

      const {
        state: { getAnimationGenerators },
      } = result.current;

      const sample = jest.fn();
      getAnimationGenerators(target).forEach((generator, i) => {
        generator(sample);
        expect(sample).toHaveBeenCalledWith(type[i], args);
      });
    });

    it('calls generators for a target with propper args', () => {
      const target = 'some-target';
      const type = 'SOME_TYPE';
      const args = [
        { bounces: 3 },
        { columns: 4, duration: 400 },
        { blinks: 2, offset: 20, blarks: 6 },
      ];
      const animations = [
        { target, type: type, ...args[0] },
        { target, type: type, ...args[1] },
        { target, type: type, ...args[2] },
      ];

      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations,
        }),
      });

      const {
        state: { getAnimationGenerators },
      } = result.current;

      const sample = jest.fn();
      getAnimationGenerators(target).forEach((generator, i) => {
        generator(sample);
        expect(sample).toHaveBeenCalledWith(type, args[i]);
      });
    });
  });

  describe('hoistWAAPIAnimation(WAAPIAnimation)', () => {
    it('returns an unhoist function when called', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations: [],
        }),
      });

      const {
        actions: { hoistWAAPIAnimation },
      } = result.current;

      const unhoist = hoistWAAPIAnimation({});

      expect(typeof unhoist).toBe('function');
    });
  });

  describe('playWAAPIAnimations()', () => {
    it.todo('calls all hoisted animations `play()` method once');
  });
});
