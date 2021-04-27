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

export const PPC_CHECKPOINT_STATE = {
  UNAVAILABLE: 'unavailable',
  ONLY_RECOMMENDED: 'recommended',
  ALL: 'all',
};

export const PPC_CHECKPOINT_ACTION = {
  ON_INITIAL_ELEMENT_ADDED: 'story is no longer empty',
  ON_PUBLISH_CLICKED: 'publish button is pressed',
  ON_STORY_HAS_2_PAGES: "story 'recommended' section enabled",
  ON_STORY_HAS_5_PAGES: "story 'high priority' section enabled",
};

const machine = {
  [PPC_CHECKPOINT_STATE.UNAVAILABLE]: {
    [PPC_CHECKPOINT_ACTION.ON_INITIAL_ELEMENT_ADDED]:
      PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED,
    [PPC_CHECKPOINT_ACTION.ON_PUBLISH_CLICKED]: PPC_CHECKPOINT_STATE.ALL,
    [PPC_CHECKPOINT_ACTION.ON_STORY_HAS_2_PAGES]:
      PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED,
  },
  [PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED]: {
    [PPC_CHECKPOINT_ACTION.ON_STORY_HAS_5_PAGES]: PPC_CHECKPOINT_STATE.ALL,
    [PPC_CHECKPOINT_ACTION.ON_PUBLISH_CLICKED]: PPC_CHECKPOINT_STATE.ALL,
  },
  [PPC_CHECKPOINT_STATE.ALL]: {},
};

export const checkpointReducer = (state, action) => {
  return machine[state][action] || state;
};
