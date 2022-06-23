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
 * Internal dependencies
 */
import MediaRecordingContext from '../context';
import ErrorDialog from '../errorDialog';

const errors = {
  None: {},
  NotAllowedError: new DOMException(
    'Not allowed to access camera',
    'NotAllowedError'
  ),
  NotFoundError: new DOMException('Not camera found', 'NotFoundError'),
  OverConstrainedError: new DOMException(
    'Over constrained',
    'OverConstrainedError'
  ),
  UnknownError: new DOMException('Some unknown error message', 'UnknownError'),
};

export default {
  title: 'Stories Editor/Components/Media Recording/Error Dialog',
  component: ErrorDialog,
  args: {
    error: 'None',
    hasVideo: true,
  },
  argTypes: {
    error: {
      options: Object.keys(errors),
      control: 'select',
    },
  },
};

export const _default = (args) => {
  return (
    <MediaRecordingContext.Provider
      value={{
        state: { error: errors[args.error], videoInput: args?.hasVideo },
      }}
    >
      <ErrorDialog />
    </MediaRecordingContext.Provider>
  );
};
