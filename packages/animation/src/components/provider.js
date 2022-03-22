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
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  createContext,
} from '@googleforcreators/react';
import { clamp } from '@googleforcreators/units';
import { v4 as uuidv4 } from 'uuid';

if (!('KeyframeEffect' in window)) {
  import(
    /* webpackChunkName: "chunk-web-animations-js" */ 'web-animations-js/web-animations-next-lite.min.js'
  ).catch(() => undefined);
}

/**
 * Internal dependencies
 */
import { StoryElementPropType } from '../types';
import { AnimationPart } from '../parts';
import { AnimationProps } from '../parts/types';

const Context = createContext(null);

const WAAPIAnimationMachine = {
  idle: {
    complete: 'complete',
  },
  complete: {
    reset: 'idle',
  },
};

const WAAPIAnimationStateReducer = (state, action) => {
  return WAAPIAnimationMachine[state][action] || state;
};

const createOnFinishPromise = ({ animation }) => {
  return new Promise((resolve) => {
    animation.onfinish = resolve;
  });
};

const filterWAAPIAnimations = ({ animations, selectedElementIds }) =>
  selectedElementIds.length > 0
    ? animations.filter(({ elementId }) =>
        selectedElementIds.includes(elementId)
      )
    : animations;

const STABLE_ARRAY = [];
function mapHasReferentialEntry(map, [key, val]) {
  return map?.has(key) && map.get(key) === val;
}

function Provider({
  animations,
  elements,
  children,
  onWAAPIFinish,
  selectedElementIds = [],
}) {
  const elementsInstanceMapRef = useRef(null);
  const elementsInstanceMap = useMemo(
    () =>
      (elements || []).reduce((map, element) => {
        map.set(element.id, element);
        return map;
      }, new Map()),
    [elements]
  );

  const animationsInstanceMapRef = useRef(null);
  const animationsInstanceMap = useMemo(
    () =>
      (animations || []).reduce((map, animation) => {
        map.set(animation.id, animation);
        return map;
      }, new Map()),
    [animations]
  );

  const animationPartsMapRef = useRef(null);
  const animationPartsMap = useMemo(() => {
    // Keeping track of maps from previous renders to be able to persist
    // referentially stable generated animations that need no update.
    const { current: oldAnimationsInstanceMap } = animationsInstanceMapRef;
    const { current: oldElementsInstanceMap } = elementsInstanceMapRef;
    const { current: oldAnimationPartsMap } = animationPartsMapRef;

    const _animationPartsMap = new Map();
    for (const [animationId, animation] of animationsInstanceMap.entries()) {
      // See if animationPart needs an update from last animation update
      const isAnimationRefenctiallyStable = mapHasReferentialEntry(
        oldAnimationsInstanceMap,
        [animationId, animation]
      );

      // See if animationPart needs an update from any target elements updating
      // (animations only have 1 target element, so this may look O(n) but it's
      // really O(1) in actuality)
      const areAnimationTargetElementsReferenciallyStable =
        animation.targets.every((elementId) =>
          mapHasReferentialEntry(oldElementsInstanceMap, [
            elementId,
            elementsInstanceMap.get(elementId),
          ])
        );

      // Persist last generated animation if neither animation nor targets have updated
      if (
        isAnimationRefenctiallyStable &&
        areAnimationTargetElementsReferenciallyStable
      ) {
        animation.targets.forEach((elementId) =>
          _animationPartsMap.set(elementId, oldAnimationPartsMap.get(elementId))
        );
      } else {
        // Generate new animationPart if input has changed.
        const { id, targets, type, ...args } = animation;

        (targets || []).forEach((elementId) => {
          const generatedParts = _animationPartsMap.get(elementId) || [];
          const element = elementsInstanceMap.get(elementId);

          _animationPartsMap.set(elementId, [
            ...generatedParts,
            AnimationPart(type, { ...args, element }),
          ]);
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
    (target) => {
      return animationPartsMap.get(target) || STABLE_ARRAY;
    },
    [animationPartsMap]
  );

  /**
   * WAAPI interface
   */
  const onWAAPIFinishRef = useRef(onWAAPIFinish);
  const [WAAPIAnimationState, dispatchWAAPIAnimationState] = useReducer(
    WAAPIAnimationStateReducer,
    'idle'
  );
  const WAAPIAnimationMap = useRef(new Map());
  const [WAAPIAnimations, setWAAPIAnimations] = useState([]);
  const filteredWAAPIAnimations = useMemo(
    () =>
      filterWAAPIAnimations({
        animations: WAAPIAnimations,
        selectedElementIds,
      }),
    [selectedElementIds, WAAPIAnimations]
  );

  const hoistWAAPIAnimation = useCallback(
    ({ animation: WAPPIAnimation, elementId }) => {
      const symbol = Symbol();
      WAAPIAnimationMap.current.set(symbol, {
        animation: WAPPIAnimation,
        elementId,
      });
      setWAAPIAnimations(Array.from(WAAPIAnimationMap.current.values()));
      return () => {
        WAPPIAnimation?.cancel();
        WAAPIAnimationMap.current.delete(symbol);
        setWAAPIAnimations(Array.from(WAAPIAnimationMap.current.values()));
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
    const setCurrentTime = (time) =>
      filteredWAAPIAnimations.forEach(({ animation }) => {
        const { duration, delay } =
          (animation.effect?.timing || animation.effect?.getTiming()) ?? {};
        const animationEndTime = (delay || 0) + (duration || 0);
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
    let cancel = () => {};
    if ('idle' === WAAPIAnimationState && filteredWAAPIAnimations.length) {
      new Promise((resolve, reject) => {
        cancel = reject;
        Promise.all(filteredWAAPIAnimations.map(createOnFinishPromise)).then(
          () => {
            cancel = () => {};
            resolve();
          }
        );
      })
        .then(() => dispatchWAAPIAnimationState('complete'))
        /* needed if promise gets canceled to swallow the error */
        .catch(() => {});
    }
    return cancel;
  }, [filteredWAAPIAnimations, WAAPIAnimationState]);

  onWAAPIFinishRef.current = onWAAPIFinish;
  useEffect(() => {
    if ('complete' === WAAPIAnimationState) {
      onWAAPIFinishRef.current?.();
      dispatchWAAPIAnimationState('reset');
    }
  }, [WAAPIAnimationState]);

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

Provider.propTypes = {
  animations: PropTypes.arrayOf(PropTypes.shape(AnimationProps)),
  elements: PropTypes.arrayOf(StoryElementPropType),
  children: PropTypes.node.isRequired,
  onWAAPIFinish: PropTypes.func,
  selectedElementIds: PropTypes.arrayOf(PropTypes.string),
};

export default Provider;
export { Context as StoryAnimationContext };
