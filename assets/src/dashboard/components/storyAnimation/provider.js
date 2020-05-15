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
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useReducer,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

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

const createOnFinishPromise = (animation) => {
  return new Promise((resolve) => {
    animation.onfinish = resolve;
  });
};

function Provider({ animations, children, onWAAPIFinish }) {
  const animationGeneratorMap = useMemo(() => {
    return (animations || []).reduce((map, animation) => {
      const { targets, type, ...args } = animation;

      (targets || []).forEach((t) => {
        const animationGenerators = map.get(t) || [];
        map.set(t, [...animationGenerators, (fn) => fn(type, args)]);
      });

      return map;
    }, new Map());
  }, [animations]);

  const getAnimationGenerators = useCallback(
    (target) => {
      return animationGeneratorMap.get(target) || [];
    },
    [animationGeneratorMap]
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

  const hoistWAAPIAnimation = useCallback((WAPPIAnimation) => {
    const symbol = Symbol();
    WAAPIAnimationMap.current.set(symbol, WAPPIAnimation);
    setWAAPIAnimations(Array.from(WAAPIAnimationMap.current.values()));
    return () => {
      WAPPIAnimation?.cancel();
      WAAPIAnimationMap.current.delete(symbol);
      setWAAPIAnimations(Array.from(WAAPIAnimationMap.current.values()));
    };
  }, []);

  const playWAAPIAnimations = useCallback(() => {
    WAAPIAnimations.forEach((animation) => animation?.play());
  }, [WAAPIAnimations]);

  /**
   * Browser support for `animation.finished` is no good.
   * https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished
   *
   * So we're mimicking the spec by creating a new promise everytime all
   * animations complete.
   */
  useEffect(() => {
    let cancel = () => {};
    if ('idle' === WAAPIAnimationState && WAAPIAnimations.length) {
      new Promise((resolve, reject) => {
        cancel = reject;
        Promise.all(WAAPIAnimations.map(createOnFinishPromise)).then(() => {
          cancel = () => {};
          resolve();
        });
      })
        .then(() => dispatchWAAPIAnimationState('complete'))
        /* needed if promise gets canceled to swallow the error */
        .catch(() => {});
    }
    return cancel;
  }, [WAAPIAnimations, WAAPIAnimationState]);

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
        getAnimationGenerators,
      },
      actions: {
        hoistWAAPIAnimation,
        playWAAPIAnimations,
      },
    }),
    [getAnimationGenerators, hoistWAAPIAnimation, playWAAPIAnimations]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

Provider.propTypes = {
  animations: PropTypes.arrayOf(PropTypes.object).isRequired,
  children: PropTypes.node.isRequired,
  onWAAPIFinish: PropTypes.func,
};

export default Provider;
export { Context as StoryAnimationContext };
