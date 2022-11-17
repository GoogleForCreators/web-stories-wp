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
import { useFeature } from 'flagged';
import { renderHook, act } from '@testing-library/react-hooks';
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import { AnimationProvider, useStoryAnimationContext } from '..';
import * as animationParts from '../../parts';
import { AnimationType } from '../../types';

jest.mock('flagged');
const mockedUseFeature = jest.mocked(useFeature);

function flushPromiseQueue() {
  return Promise.resolve();
}

function mockCreateAnimationPart() {
  return jest
    .spyOn(animationParts, 'createAnimationPart')
    .mockImplementation(() => ({
      id: '',
      keyframes: {},
      WAAPIAnimation: { keyframes: {}, timings: {} },
      AMPTarget: () => null,
      AMPAnimation: () => null,
      generatedKeyframes: {},
    }));
}

function createWrapperWithProps<T>(
  Wrapper: React.FunctionComponent<T>,
  props: T
) {
  const WrapperWithProps = function ({ children }: PropsWithChildren<T>) {
    return <Wrapper {...props}>{children}</Wrapper>;
  };
  return WrapperWithProps;
}

const mockWAAPIAnimation = (overrides = {}) => ({
  ...new Animation(),
  ...overrides,
});

type MockAnimation = Animation & {
  play: (this: void) => void;
  pause: (this: void) => void;
};

describe('AnimationProvider', () => {
  beforeAll(() => {
    mockedUseFeature.mockImplementation(() => true);
  });

  describe('getAnimationParts(target)', () => {
    it('gets all generated parts for a target', () => {
      const target = 'some-target';
      const targets = [target];
      const animations = [
        {
          id: '1',
          targets,
          type: AnimationType.Move,
          duration: 1000,
        },
        {
          id: '2',
          targets,
          type: AnimationType.Spin,
          duration: 1000,
        },
        {
          id: '3',
          targets: ['other-target'],
          type: AnimationType.Move,
          duration: 1000,
        },
        {
          id: '4',
          targets: [target, 'other-target'],
          type: AnimationType.Zoom,
          duration: 1000,
        },
      ];

      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(AnimationProvider, {
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
      const args = { someProp: 1, duration: 1000 };
      const types = [
        AnimationType.Move,
        AnimationType.Spin,
        AnimationType.Zoom,
      ];
      const animations = [
        { id: '1', targets, type: types[0], ...args },
        { id: '2', targets, type: types[1], ...args },
        { id: '3', targets, type: types[2], ...args },
      ];

      const AnimationPartMock = mockCreateAnimationPart();

      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(AnimationProvider, {
          animations,
        }),
      });

      const {
        actions: { getAnimationParts },
      } = result.current;

      getAnimationParts(target);

      animations.forEach(({ type }) => {
        expect(animationParts.createAnimationPart).toHaveBeenCalledWith({
          type,
          args: { ...args, element: undefined },
        });
      });

      AnimationPartMock.mockRestore();
    });

    it('calls generators for a target with propper args', () => {
      const target = 'some-target';
      const target2 = 'that-target';
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
      const animType = AnimationType.Move;
      const args = [
        { bounces: 3, duration: 1000 },
        { blinks: 2, offset: 20, blarks: 6, duration: 1000 },
        { columns: 4, duration: 400 },
      ];
      const animations = [
        { id: '1', targets: [target], type: animType, ...args[0] },
        { id: '2', targets: [target], type: animType, ...args[1] },
        { id: '3', targets: [target2], type: animType, ...args[2] },
      ];

      const AnimationPartMock = mockCreateAnimationPart();

      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(AnimationProvider, {
          animations,
          elements,
        }),
      });

      const {
        actions: { getAnimationParts },
      } = result.current;

      getAnimationParts(target);
      animations
        .filter(({ targets }) => targets.includes(target))
        .forEach(({ type, ...rest }) => {
          expect(mockCreateAnimationPart).toHaveBeenCalledWith({
            type,
            args: { ...rest, element: element1 },
          });
        });

      getAnimationParts(target2);
      animations
        .filter(({ targets }) => targets.includes(target2))
        .forEach(({ type, ...rest }) => {
          expect(mockCreateAnimationPart).toHaveBeenCalledWith({
            type,
            args: { ...rest, element: element1 },
          });
        });

      AnimationPartMock.mockRestore();
    });
  });

  describe('hoistWAAPIAnimation(WAAPIAnimation)', () => {
    it('returns a cleanup function when called', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(AnimationProvider, {
          animations: [],
        }),
      });

      let unhoist;
      act(() => {
        unhoist = result.current.actions.hoistWAAPIAnimation({
          animation: mockWAAPIAnimation(),
          elementId: '',
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
        wrapper: createWrapperWithProps(AnimationProvider, {
          animations: [],
        }),
      });

      const cancel = jest.fn();
      act(() => {
        const unhoist = result.current.actions.hoistWAAPIAnimation({
          animation: mockWAAPIAnimation({ cancel }),
          elementId: '',
        });
        unhoist();
      });
      expect(cancel).toHaveBeenCalledWith();
    });
  });

  describe('WAAPIAnimationMethods', () => {
    it('calls all hoisted Animation methods when called', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(AnimationProvider, {
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
          result.current.actions.hoistWAAPIAnimation({
            animation,
            elementId: '',
          });
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
        wrapper: createWrapperWithProps(AnimationProvider, {
          animations: [],
          selectedElementIds,
        }),
      });

      const animationsWithIds = allElementIds.map((elementId) => {
        const animation: MockAnimation = mockWAAPIAnimation({
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
    });

    it('excludes cleaned up animation methods when called', () => {
      const { result } = renderHook(() => useStoryAnimationContext(), {
        wrapper: createWrapperWithProps(AnimationProvider, {
          animations: [],
        }),
      });

      const initialTime = 0;
      const newTime = 200;

      const numAnims = 10;
      const unhoistIndex = numAnims / 2;
      const animations = Array.from(
        { length: numAnims },
        (): MockAnimation =>
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
        let unhoist: () => void = () => undefined;
        act(() => {
          unhoist = result.current.actions.hoistWAAPIAnimation({
            animation,
            elementId: '',
          });
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

      animations.forEach((animation, i) => {
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
    });
  });

  describe('events', () => {
    describe('onWAAPIFinish', () => {
      it('fires once each time all animations complete', async () => {
        const onWAAPIFinish = jest.fn();
        const { result } = renderHook(() => useStoryAnimationContext(), {
          wrapper: createWrapperWithProps(AnimationProvider, {
            animations: [],
            onWAAPIFinish,
          }),
        });

        const animations = Array.from({ length: 10 }, () =>
          mockWAAPIAnimation()
        );
        animations.forEach((animation) => {
          act(() => {
            result.current.actions.hoistWAAPIAnimation({
              animation,
              elementId: '',
            });
          });
        });

        const completeAllAnimations = async () => {
          animations.forEach((animation) => {
            animation?.onfinish?.(new AnimationPlaybackEvent('finish'));
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
