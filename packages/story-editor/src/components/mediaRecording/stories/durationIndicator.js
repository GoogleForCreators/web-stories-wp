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
import DurationIndicator from '../durationIndicator';

export default {
  title: 'Stories Editor/Components/Media Recording/DurationIndicator',
  component: DurationIndicator,
  args: {
    duration: 199,
    isRecording: true,
  },
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
};

export const _default = {
  render: function Render(args) {
    return (
      <MediaRecordingContext.Provider
        value={{
          state: {
            ...args,
            status: args.isRecording ? 'recording' : 'stopped',
          },
        }}
      >
        <DurationIndicator />
      </MediaRecordingContext.Provider>
    );
  },
};
