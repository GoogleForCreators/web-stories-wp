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
const cumulativeDuration = {};

// profiler callback
// https://reactjs.org/docs/profiler.html#onrender-callback
export const getProfileData = ([
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions, // the Set of interactions belonging to this update
]) => {
  if (!cumulativeDuration[id]) {
    cumulativeDuration[id] = 0;
  }
  cumulativeDuration[id] = Number(
    (cumulativeDuration[id] + actualDuration).toFixed(2)
  );
  return {
    id,
    interactions,
    phase,
    actualDuration: Number(actualDuration.toFixed(2)),
    baseDuration: Number(baseDuration.toFixed(2)),
    commitTime: Number(commitTime.toFixed(2)),
    cumulativeDuration: cumulativeDuration[id],
    startTime: Number(startTime.toFixed(2)),
  };
};

export const logProfileData = ({
  actualDuration,
  baseDuration,
  cumulativeDuration,
  phase,
  id,
}) => {
  console.group(id);
  console.table({
    actualDuration,
    baseDuration,
    cumulativeDuration,
  });
  console.groupEnd();
};
