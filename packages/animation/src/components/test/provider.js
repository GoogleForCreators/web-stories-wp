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
import PropTypes from 'prop-types';
import { useFeature } from 'flagged';
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import { StoryAnimation, useStoryAnimationContext } from '..';
import * as animationParts from '../../parts';

jest.mock('flagged');

function flushPromiseQueue() {
  return new Promise((resolve) => resolve());
}

function createWrapperWithProps(Wrapper, props) {
  const WrapperWithProps = function ({ children }) {
    return <Wrapper {...props}>{children}</Wrapper>;
  };
  WrapperWithProps.propTypes = { children: PropTypes.node };
  return WrapperWithProps;
}

const defaultWAAPIAnimation = {
  onfinish: null,
  cancel: () => {},
  play: () => {},
  effect: {
    timing: {
      duration: 0,
      delay: 0,
    },
    getTiming: () => ({
      duration: 0,
      delay: 0,
    }),
  },
};
const mockWAAPIAnimation = (overrides = {}) => ({
  ...defaultWAAPIAnimation,
  ...overrides,
});

describe('StoryAnimation.Provider', () => {
  beforeAll(() => {
    useFeature.mockImplementation(() => true);
  });

  describe('getAnimationParts(target)', () => {
    it('gets all generated parts for a target', () => {
      const target = 'some-target';
      const targets = [target];
      const animations = [
        { id: '1', targets, type: 'move' },
        { id: '2', targets, type: 'spin' },
        { id: '3', targets: ['other-target'], type: 'move' },
        { id: '4', targets: [target, 'other-target'], type: 'zoom' },
      ];

      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations,
        }),
      });

      const {
        actions: { getAnimationParts },
      } = result.current;

      expect(getAnimationParts(target)).toHaveLength(3);
      expect(getAnimationParts('other-target')).toHaveLength(2);
      expect(getAnimationParts('not used target')).toHaveLength(0);
    });

    it('calls generators for a target in ascending order', () => {
      const target = 'some-target';
      const targets = [target];
      const args = { someProp: 1 };
      const type = ['move', 'spin', 'zoom'];
      const animations = [
        { id: '1', targets, type: type[0], ...args },
        { id: '2', targets, type: type[1], ...args },
        { id: '3', targets, type: type[2], ...args },
      ];

      const AnimationPartMock = jest
        .spyOn(animationParts, 'AnimationPart')
        .mockImplementation((t, a) => ({
          type: t,
          args: a,
        }));

      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations,
        }),
      });

      const {
        actions: { getAnimationParts },
      } = result.current;

      getAnimationParts(target).forEach((animationPart, i) => {
        expect(animationPart).toStrictEqual({
          type: type[i],
          args: { ...args, element: undefined },
        });
      });

      AnimationPartMock.mockRestore();
    });

    it('calls generators for a target with propper args', () => {
      const target = 'some-target';
      const target2 = 'that-target';
      const targets = [target];
      const element1 = {
        id: target,
        type: 'text',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotationAngle: 0,
      };
      const element2 = {
        id: target2,
        type: 'text',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotationAngle: 0,
      };
      const elements = [element1, element2];
      const type = 'move';
      const args = [
        { bounces: 3 },
        { blinks: 2, offset: 20, blarks: 6 },
        { columns: 4, duration: 400 },
      ];
      const animations = [
        { id: '1', targets, type: type, ...args[0] },
        { id: '2', targets, type: type, ...args[1] },
        { id: '3', targets: [target2], type: type, ...args[2] },
      ];

      const AnimationPartMock = jest
        .spyOn(animationParts, 'AnimationPart')
        .mockImplementation((t, a) => ({
          type: t,
          args: a,
        }));

      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations,
          elements,
        }),
      });

      const {
        actions: { getAnimationParts },
      } = result.current;

      getAnimationParts(target).forEach((animationPart, i) => {
        expect(animationPart).toStrictEqual({
          type,
          args: { ...args[i], element: element1 },
        });
      });

      getAnimationParts(target2).forEach((animationPart) => {
        expect(animationPart).toStrictEqual({
          type,
          args: { ...args[2], element: element2 },
        });
      });

      AnimationPartMock.mockRestore();
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
        unhoist = result.current.actions.hoistWAAPIAnimation({
          animation: mockWAAPIAnimation(),
        });
      });
      expect(typeof unhoist).toBe('function');
    });

    /**
     * Animation.cancel()**
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
        const unhoist = result.current.actions.hoistWAAPIAnimation({
          animation: mockWAAPIAnimation({ cancel }),
        });
        unhoist();
      });
      expect(cancel).toHaveBeenCalledWith();
    });
  });

  describe('WAAPIAnimationMethods', () => {
    it('calls all hoisted Animation methods when called', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations: [],
        }),
      });

      const numCalls = 10;
      const play = jest.fn();
      const pause = jest.fn();
      const animations = Array.from({ length: numCalls }, () => {
        const animation = mockWAAPIAnimation({
          play,
          pause,
          currentTime: 0,
          effect: {
            getTiming: () => ({
              duration: 300,
              delay: 0,
            }),
          },
        });
        act(() => {
          result.current.actions.hoistWAAPIAnimation({ animation });
        });
        return animation;
      });

      act(() => result.current.actions.WAAPIAnimationMethods.play());
      act(() => result.current.actions.WAAPIAnimationMethods.pause());
      act(() =>
        result.current.actions.WAAPIAnimationMethods.setCurrentTime(200)
      );

      expect(play).toHaveBeenCalledTimes(numCalls);
      expect(pause).toHaveBeenCalledTimes(numCalls);
      animations.forEach((animation) => {
        expect(animation.currentTime).toBe(200);
      });
    });

    it('calls all selectedElement hoisted Animation methods when called and passed selected elements', () => {
      const selectedElementIds = ['a', 'b', 'c'];
      const allElementIds = [...selectedElementIds, 'd', 'e'];
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations: [],
          selectedElementIds,
        }),
      });

      const animationsWithIds = allElementIds.map((elementId) => {
        const animation = mockWAAPIAnimation({
          play: jest.fn(),
          pause: jest.fn(),
          currentTime: 0,
          effect: {
            getTiming: () => ({
              duration: 300,
              delay: 0,
            }),
          },
        });
        const animationWithElementId = { animation, elementId };
        act(() => {
          result.current.actions.hoistWAAPIAnimation({ animation, elementId });
        });
        return animationWithElementId;
      });

      act(() => result.current.actions.WAAPIAnimationMethods.play());
      act(() => result.current.actions.WAAPIAnimationMethods.pause());
      act(() =>
        result.current.actions.WAAPIAnimationMethods.setCurrentTime(200)
      );

      /* eslint-disable jest/no-conditional-in-test */
      animationsWithIds.forEach(({ animation, elementId }) => {
        expect(animation.currentTime).toStrictEqual(
          selectedElementIds.includes(elementId) ? 200 : 0
        );
        expect(animation.play).toHaveBeenCalledTimes(
          selectedElementIds.includes(elementId) ? 1 : 0
        );
        expect(animation.pause).toHaveBeenCalledTimes(
          selectedElementIds.includes(elementId) ? 1 : 0
        );
      });
      /* eslint-enable jest/no-conditional-in-test */
    });

    it('excludes cleaned up animation methods when called', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(StoryAnimation.Provider, {
          animations: [],
        }),
      });

      const initialTime = 0;
      const newTime = 200;

      const numAnims = 10;
      const unhoistIndex = numAnims / 2;
      const animations = Array.from({ length: numAnims }, () =>
        mockWAAPIAnimation({
          play: jest.fn(),
          pause: jest.fn(),
          currentTime: initialTime,
          effect: {
            getTiming: () => ({
              duration: 300,
              delay: 0,
            }),
          },
        })
      );

      const unhoists = animations.map((animation) => {
        let unhoist;
        act(() => {
          unhoist = result.current.actions.hoistWAAPIAnimation({ animation });
        });
        return unhoist;
      });
      act(() => {
        unhoists[unhoistIndex]();
      });

      act(() => result.current.actions.WAAPIAnimationMethods.play());
      act(() => result.current.actions.WAAPIAnimationMethods.pause());
      act(() =>
        result.current.actions.WAAPIAnimationMethods.setCurrentTime(newTime)
      );

      /* eslint-disable jest/no-conditional-expect, jest/no-conditional-in-test */
      animations.map((animation, i) => {
        if (i === unhoistIndex) {
          expect(animation.play).toHaveBeenCalledTimes(0);
          expect(animation.pause).toHaveBeenCalledTimes(0);
          expect(animation.currentTime).toStrictEqual(initialTime);
        } else {
          expect(animation.play).toHaveBeenCalledTimes(1);
          expect(animation.pause).toHaveBeenCalledTimes(1);
          expect(animation.currentTime).toStrictEqual(newTime);
        }
      });
      /* eslint-enable jest/no-conditional-expect, jest/no-conditional-in-test */
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
            result.current.actions.hoistWAAPIAnimation({ animation });
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
