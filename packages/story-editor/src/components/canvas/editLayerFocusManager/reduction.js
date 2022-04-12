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
const INITIAL_STATE = {
  activeGroupKey: null,
  cleanup: null,
  focusGroups: {},
};

const reduction = {
  addNodeToGroup: (state, action) => {
    // parse payload
    const { groupId, nodeTuple } = action.payload;

    // add or update node in the nodeGroup
    const nodeGroup = state.focusGroups[groupId] || [];
    let newNodeGroup = [];
    const index = nodeGroup.findIndex(
      (_nodeTuple) => _nodeTuple[0] === nodeTuple[0]
    );
    if (index === -1) {
      newNodeGroup = [...nodeGroup, nodeTuple];
    } else {
      newNodeGroup = [
        ...nodeGroup.slice(0, index),
        nodeTuple,
        ...nodeGroup.slice(0, index + 1),
      ];
    }

    // update state
    return {
      ...state,
      focusGroups: {
        ...state.focusGroups,
        [groupId]: newNodeGroup,
      },
    };
  },

  removeNodeFromGroup: (state, action) => {
    // parse payload
    const { groupId, nodeTuple } = action.payload;

    // remove nodeTuple from group if it exists
    const nodeGroup = state.focusGroups[groupId] || [];
    const newNodeGroup = nodeGroup.filter(
      (_nodeTuple) => _nodeTuple[0] !== nodeTuple[0]
    );

    // update state
    return {
      ...state,
      focusGroups: {
        ...state.focusGroups,
        [groupId]: newNodeGroup,
      },
    };
  },

  setActiveGroup: (state, action) => {
    const { groupId, cleanup } = action.payload;
    return {
      ...state,
      activeGroupKey: groupId,
      cleanup,
    };
  },

  clearActiveGroup: (state) => {
    return {
      ...state,
      activeGroupKey: null,
      cleanup: null,
    };
  },
};

export { reduction as default, INITIAL_STATE };
