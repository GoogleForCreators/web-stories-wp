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
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import 'web-animations-js/web-animations-next-lite.min.js';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../edit-story/types';
import { clamp } from '../../animation';
import { createContext } from '../../design-system';
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

function Provider({
  animations,
  elements,
  children,
  onWAAPIFinish,
  selectedElementIds = [],
}) {
  const elementsMap = useMemo(() => {
    return (elements || []).reduce((map, element) => {
      map.set(element.id, element);
      return map;
    }, new Map());
  }, [elements]);

  const animationPartsMap = useMemo(() => {
    return (animations || []).reduce((map, animation) => {
      const { id, targets, type, ...args } = animation;

      (targets || []).forEach((t) => {
        const generatedParts = map.get(t) || [];
        const element = elementsMap.get(t);

        map.set(t, [
          ...generatedParts,
          AnimationPart(type, { ...args, element }),
        ]);
      });

      return map;
    }, new Map());
  }, [animations, elementsMap]);

  const providerId = useMemo(() => uuidv4(), []);

  const animationTargets = useMemo(
    () => Array.from(animationPartsMap.keys() || []),
    [animationPartsMap]
  );

  const getAnimationParts = useCallback(
    (target) => {
      return animationPartsMap.get(target) || [];
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
            : clamp(time, [0, animationEndTime]);
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
  elements: PropTypes.arrayOf(StoryPropTypes.element),
  children: PropTypes.node.isRequired,
  onWAAPIFinish: PropTypes.func,
  selectedElementIds: PropTypes.arrayOf(PropTypes.string),
};

export default Provider;
export { Context as StoryAnimationContext };
