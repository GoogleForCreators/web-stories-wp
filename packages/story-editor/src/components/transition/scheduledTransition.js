/*
 * Copyright 2021 Google LLC
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
import { useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

const entering = 'entering';
const entered = 'entered';
const exiting = 'exiting';
const exited = 'exited';

const machine = {
  initial: 'default',
  states: {
    default: { entering },
    entering: { entered },
    entered: { exiting },
    exiting: { exited },
    exited: {},
  },
};

const reducer = (state, action) => machine.states[state]?.[action] || state;

// Used as an interpretation layer between Transition
// and children being called with state. Allows for first
// render of default styles while keeping timeout in sync
// with state. Fixes issues discussed here:
// https://github.com/reactjs/react-transition-group/issues/284#issuecomment-771037685
export function Interpreter({ state, children }) {
  const [scheduledState, dispatch] = useReducer(
    reducer,
    state === entered ? state : machine.initial
  );
  const [nextRender, setNextRender] = useState(state);

  // Ensures we get a paint with every current state
  // we are on before we interpret an update.
  useEffect(() => {
    const id = requestAnimationFrame(() => setNextRender(state));
    return () => cancelAnimationFrame(id);
  }, [state]);

  // Use our state machine implementation to deterministically order state
  // transitions. Ensures following order & at least one render on each state:
  // default -> entering -> entered -> exiting -> exited
  useEffect(() => {
    dispatch(nextRender);
  }, [nextRender]);

  // We want to opt out of our expected behavior immediately if there's a premature
  // enter or exit scenario.
  //
  // It's important that these state changes are reflected on exactly this render,
  // as opposed to in the state machine, to prevent content flash where two children
  // of a transition group can both be in an `enter` or `exit` state in the same paint.
  const isPrematureExit =
    [entering, entered].includes(scheduledState) && state === 'exiting';
  const isPrematureEntrance =
    [exiting].includes(scheduledState) && [entering, entered].includes(state);
  const shouldUseBaseState = isPrematureEntrance || isPrematureExit;
  return children(shouldUseBaseState ? state : scheduledState);
}

export function ScheduledTransition({ children, ...props }) {
  return (
    <Transition {...props}>
      {(state) => (
        <Interpreter state={state}>
          {(scheduledState) => children(scheduledState)}
        </Interpreter>
      )}
    </Transition>
  );
}
ScheduledTransition.propTypes = {
  children: PropTypes.func,
};
