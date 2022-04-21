/*
 * Copyright 2022 Google LLC
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
import { useReduction, useCallback, useRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Context from './context';
import reduction, { INITIAL_STATE } from './reduction';
import KeyBindings from './keyBindings';

function EditLayerFocusManager({ children }) {
  const [state, actions] = useReduction(INITIAL_STATE, reduction);

  const stateRef = useRef(state);
  stateRef.current = state;

  const enterFocusGroup = useCallback(
    ({ groupId }) => {
      // grab the first node in the focus group & focus it
      const nodeTuple = stateRef.current.focusGroups?.[groupId]?.[0];
      if (nodeTuple) {
        const [, node] = nodeTuple;
        node.focus();
      }
    },
    [stateRef]
  );

  const focusGroups = Object.entries(state.focusGroups);
  const focusGroupCleanupCallbacks = state.cleanupCallbacks;

  return (
    <Context.Provider
      value={{
        enterFocusGroup,
        setFocusGroupCleanup: actions.setFocusGroupCleanup,
        actions,
      }}
    >
      {focusGroups.map(([groupId, focusGroup]) =>
        focusGroup.map(
          ([uuid, node]) =>
            node && (
              <KeyBindings
                key={uuid}
                uuid={uuid}
                node={node}
                focusGroup={focusGroup}
                exitFocusGroup={focusGroupCleanupCallbacks[groupId]}
              />
            )
        )
      )}
      {children}
    </Context.Provider>
  );
}

EditLayerFocusManager.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default EditLayerFocusManager;
