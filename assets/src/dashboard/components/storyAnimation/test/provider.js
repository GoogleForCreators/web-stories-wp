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
import { renderHook, act } from '@testing-library/react-hooks';
/**
 * Internal dependencies
 */
import { createWrapperWithProps, flushPromiseQueue } from '../../../testUtils';
import StoryAnimation, { useStoryAnimationContext } from '..';

const defaultWAAPIAnimation = {
  onfinish: null,
  cancel: () => {},
  play: () => {},
};
const mockWAAPIAnimation = (overrides = {}) => ({
  ...defaultWAAPIAnimation,
  ...overrides,
});

describe('StoryAnimation.Provider', () => {
  describe('getAnimationGenerators(target)', () => {
    it('calls all generators for a target', () => {
      const target = 'some-target';
      const targets = [target];
      const animations = [
        { targets, type: 'TYPE1' },
        { targets, type: 'TYPE2' },
        { targets: ['other-target'], type: 'TYPE1' },
        { targets: [target, 'other-target'], type: 'TYPE5' },
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
      const targets = [target];
      const args = { someProp: 1 };
      const type = ['TYPE1', 'TYPE2', 'TYPE3'];
      const animations = [
        { targets, type: type[0], ...args },
        { targets, type: type[1], ...args },
        { targets, type: type[2], ...args },
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
      const targets = [target];
      const type = 'SOME_TYPE';
      const args = [
        { bounces: 3 },
        { columns: 4, duration: 400 },
        { blinks: 2, offset: 20, blarks: 6 },
      ];
      const animations = [
        { targets, type: type, ...args[0] },
        { targets, type: type, ...args[1] },
        { targets, type: type, ...args[2] },
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
    it('returns a cleanup function when called', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations: [],
        }),
      });

      let unhoist;
      act(() => {
        unhoist = result.current.actions.hoistWAAPIAnimation(
          mockWAAPIAnimation()
        );
      });
      expect(typeof unhoist).toBe('function');
    });

    /**
     * **Animation.cancel()**
     *
     * Clears all KeyframeEffects caused by this animation
     * and aborts its playback.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel
     */
    it('calls Animation.cancel() method on hoisted animation when cleanup performed', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations: [],
        }),
      });

      const cancel = jest.fn();
      act(() => {
        let unhoist;
        unhoist = result.current.actions.hoistWAAPIAnimation(
          mockWAAPIAnimation({ cancel })
        );
        unhoist();
      });
      expect(cancel).toHaveBeenCalledWith();
    });
  });

  describe('playWAAPIAnimations()', () => {
    it('calls all hoisted Animation.play() methods when called', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations: [],
        }),
      });

      const numCalls = 10;
      const play = jest.fn();
      for (let i = 0; i < numCalls; i++) {
        act(() => {
          result.current.actions.hoistWAAPIAnimation(
            mockWAAPIAnimation({ play })
          );
        });
      }
      act(() => result.current.actions.playWAAPIAnimations());
      expect(play).toHaveBeenCalledTimes(numCalls);
    });

    it('excludes cleaned up animation methods when called', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations: [],
        }),
      });

      const numAnims = 10;
      const unhoistIndex = numAnims / 2;
      const animations = Array.from({ length: numAnims }, () =>
        mockWAAPIAnimation({
          play: jest.fn(),
        })
      );
      const unhoists = animations.map((animation) => {
        let unhoist;
        act(() => {
          unhoist = result.current.actions.hoistWAAPIAnimation(animation);
        });
        return unhoist;
      });
      act(() => {
        unhoists[unhoistIndex]();
      });
      act(() => result.current.actions.playWAAPIAnimations());
      animations.map(({ play }, i) => {
        if (i === unhoistIndex) {
          expect(play).toHaveBeenCalledTimes(0);
        } else {
          expect(play).toHaveBeenCalledTimes(1);
        }
      });
    });
  });

  describe('events', () => {
    describe('onWAAPIFinish', () => {
      it('fires once each time all animations complete', async () => {
        const onWAAPIFinish = jest.fn();
        const { result } = renderHook(() => useStoryAnimationContext(), {
          wrapper: createWrapperWithProps(StoryAnimation.Provider, {
            animations: [],
            onWAAPIFinish,
          }),
        });

        const animations = Array.from({ length: 10 }, () =>
          mockWAAPIAnimation()
        );
        animations.forEach((animation) => {
          act(() => {
            result.current.actions.hoistWAAPIAnimation(animation);
          });
        });

        const completeAllAnimations = async () => {
          animations.forEach((animation) => {
            animation.onfinish();
          });
          /**
           * Needed to flush all promises and
           * trigger dispatch from resolved promise
           */
          await act(async () => {
            await flushPromiseQueue();
          });
        };

        await completeAllAnimations();
        expect(onWAAPIFinish).toHaveBeenCalledTimes(1);
        await completeAllAnimations();
        expect(onWAAPIFinish).toHaveBeenCalledTimes(2);
        await completeAllAnimations();
        expect(onWAAPIFinish).toHaveBeenCalledTimes(3);
      });
    });
  });
});
