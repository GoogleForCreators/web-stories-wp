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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import { clamp } from '@googleforcreators/units';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { type AnimationPart, createAnimationPart } from '../parts';
import type { Element, StoryAnimation } from '../types';
import type {
  ElementId,
  ElementMap,
  ElementAnimationPartsMap,
  AnimationProviderProps,
  WAAPIElementAnimation,
  WAAPIElementAnimationMap,
  StoryAnimationMap,
} from './types';
import Context from './context';
import useAnimationMachine, { AnimationMachineState } from './animationMachine';

const createOnFinishPromise = (animation: Animation) => {
  return new Promise((resolve) => {
    animation.onfinish = resolve;
  });
};

const filterWAAPIAnimations = (
  animations: WAAPIElementAnimation[],
  selectedElementIds: ElementId[]
) =>
  selectedElementIds.length > 0
    ? animations.filter(({ elementId }) =>
        selectedElementIds.includes(elementId)
      )
    : animations;

const STABLE: unknown[] = [];

function mapHasReferentialEntry<K, V>(
  map: null | Map<K, V>,
  [key, val]: [K, V]
) {
  return map?.has(key) && map.get(key) === val;
}

function Provider({
  animations = STABLE as StoryAnimation[],
  elements = STABLE as Element[],
  children,
  onWAAPIFinish,
  selectedElementIds = [],
}: AnimationProviderProps) {
  const elementsInstanceMapRef = useRef<ElementMap | null>(null);
  const elementsInstanceMap: ElementMap = useMemo(
    () => new Map(elements.map((element) => [element.id, element])),
    [elements]
  );

  const animationsInstanceMapRef = useRef<StoryAnimationMap | null>(null);
  const animationsInstanceMap: StoryAnimationMap = useMemo(
    () => new Map(animations.map((animation) => [animation.id, animation])),
    [animations]
  );

  const animationPartsMapRef = useRef<ElementAnimationPartsMap | null>(null);
  const animationPartsMap = useMemo(() => {
    // Keeping track of maps from previous renders to be able to persist
    // referentially stable generated animations that need no update.
    const { current: oldAnimationsInstanceMap } = animationsInstanceMapRef;
    const { current: oldElementsInstanceMap } = elementsInstanceMapRef;
    const { current: oldAnimationPartsMap } = animationPartsMapRef;

    const _animationPartsMap: ElementAnimationPartsMap = new Map();
    for (const [animationId, animation] of animationsInstanceMap.entries()) {
      // See if animationPart needs an update from last animation update
      const isAnimationRefentiallyStable = mapHasReferentialEntry(
        oldAnimationsInstanceMap,
        [animationId, animation]
      );

      // See if animationPart needs an update from any target elements updating
      // (animations only have 1 target element, so this may look O(n) but it's
      // really O(1) in actuality)
      const areAnimationTargetElementsReferentiallyStable =
        animation.targets.every((elementId) =>
          mapHasReferentialEntry(oldElementsInstanceMap, [
            elementId,
            elementsInstanceMap.get(elementId),
          ])
        );

      // Persist last generated animation if neither animation nor targets have updated
      if (
        isAnimationRefentiallyStable &&
        areAnimationTargetElementsReferentiallyStable &&
        oldAnimationPartsMap !== null
      ) {
        animation.targets.forEach((elementId) => {
          const element = elementsInstanceMap.get(elementId);
          if (!element?.isHidden) {
            _animationPartsMap.set(
              elementId,
              oldAnimationPartsMap.get(elementId) || []
            );
          }
        });
      } else {
        // Generate new animationPart if input has changed.
        const { targets } = animation;

        (targets || []).forEach((elementId) => {
          const generatedParts = _animationPartsMap.get(elementId) || [];
          const element = elementsInstanceMap.get(elementId);

          if (!element) {
            // This should not happen.
            return;
          }

          if (!element.isHidden) {
            _animationPartsMap.set(elementId, [
              ...generatedParts,
              createAnimationPart(animation, element),
            ]);
          }
        });
      }
    }

    // Sync up map refs to reference on next generation of animationPartsMap
    animationsInstanceMapRef.current = animationsInstanceMap;
    elementsInstanceMapRef.current = elementsInstanceMap;
    animationPartsMapRef.current = _animationPartsMap;

    return _animationPartsMap;
  }, [animationsInstanceMap, elementsInstanceMap]);

  const providerId = useMemo(() => uuidv4(), []);

  const animationTargets = useMemo(
    () => Array.from(animationPartsMap.keys() || []),
    [animationPartsMap]
  );

  const getAnimationParts = useCallback(
    (target: ElementId) =>
      animationPartsMap.get(target) || (STABLE as AnimationPart[]),
    [animationPartsMap]
  );

  /**
   * WAAPI interface
   */
  const onWAAPIFinishRef = useRef(onWAAPIFinish);
  const { animationState, reset, complete } = useAnimationMachine();
  const WAAPIAnimationRef = useRef<WAAPIElementAnimationMap>(new Map());
  const [WAAPIAnimations, setWAAPIAnimations] = useState<
    WAAPIElementAnimation[]
  >([]);
  const filteredWAAPIAnimations = useMemo(
    () => filterWAAPIAnimations(WAAPIAnimations, selectedElementIds),
    [selectedElementIds, WAAPIAnimations]
  );

  const hoistWAAPIAnimation = useCallback(
    ({ animation, elementId }: WAAPIElementAnimation) => {
      const symbol = Symbol();
      WAAPIAnimationRef.current.set(symbol, {
        animation,
        elementId,
      });
      setWAAPIAnimations(Array.from(WAAPIAnimationRef.current.values()));
      return () => {
        animation?.cancel();
        WAAPIAnimationRef.current.delete(symbol);
        setWAAPIAnimations(Array.from(WAAPIAnimationRef.current.values()));
      };
    },
    []
  );

  const WAAPIAnimationMethods = useMemo(() => {
    const play = () =>
      filteredWAAPIAnimations.forEach(({ animation }) => {
        // Sometimes an animation part can get into a
        // stuck state where executing `play` doesn't
        // trigger the animation. A workaround to avoid
        // this is to first `cancel` the animation
        // before playing.
        animation?.cancel();

        animation?.play();
      });
    const pause = () =>
      filteredWAAPIAnimations.forEach(({ animation }) => animation?.pause());
    const setCurrentTime = (time: number | 'end') =>
      filteredWAAPIAnimations.forEach(({ animation }) => {
        const { duration = 0, delay = 0 } = animation.effect?.getTiming() ?? {};
        // The duration can be "auto", which we must treat as 0 in this instance
        // @see https://w3c.github.io/csswg-drafts/web-animations-1/#dictdef-effecttiming
        // Note that we could use `getComputedTiming` above instead, but the typings
        // in @types/web-animations-js aren't completely correct for that return.
        const actualDuration = typeof duration === 'string' ? 0 : duration;
        const animationEndTime = delay + actualDuration;
        animation.currentTime =
          time === 'end'
            ? animationEndTime
            : clamp(time, { MIN: 0, MAX: animationEndTime });
      });

    return {
      play,
      pause,
      setCurrentTime,
      reset: () => {
        pause();
        requestAnimationFrame(() => {
          setCurrentTime('end');
        });
      },
    };
  }, [filteredWAAPIAnimations]);

  /**
   * Browser support for `animation.finished` is no good.
   * https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished
   *
   * So we're mimicking the spec by creating a new promise everytime all
   * animations complete.
   */
  useEffect(() => {
    let cancel: () => void = () => undefined;
    if (
      AnimationMachineState.Idle === animationState &&
      filteredWAAPIAnimations.length
    ) {
      new Promise<void>((resolve, reject) => {
        cancel = reject;
        void Promise.all(
          filteredWAAPIAnimations.map(({ animation }) =>
            createOnFinishPromise(animation)
          )
        ).then(() => {
          cancel = () => undefined;
          resolve();
        });
      })
        .then(complete)
        /* needed if promise gets canceled to swallow the error */
        .catch(() => undefined);
    }
    return cancel;
  }, [filteredWAAPIAnimations, animationState, complete]);

  onWAAPIFinishRef.current = onWAAPIFinish;
  useEffect(() => {
    if (AnimationMachineState.Complete === animationState) {
      onWAAPIFinishRef.current?.();
      reset();
    }
  }, [animationState, reset]);

  const value = useMemo(
    () => ({
      state: {
        providerId,
        animationTargets,
      },
      actions: {
        getAnimationParts,
        hoistWAAPIAnimation,
        WAAPIAnimationMethods,
      },
    }),
    [
      providerId,
      getAnimationParts,
      animationTargets,
      hoistWAAPIAnimation,
      WAAPIAnimationMethods,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default Provider;
