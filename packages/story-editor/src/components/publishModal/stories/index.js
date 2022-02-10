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
import { useCallback, useState } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import StoryContext from '../../../app/story/context';
import { noop } from '../../../utils/noop';
import { CheckpointContext } from '../../checklist';
import PublishModal from '../publishModal';

export default {
  title: 'Stories Editor/Components/Dialog/Publish Modal',
  args: {
    isOpen: true,
  },
  argTypes: {
    onPublish: { action: 'onPublish clicked' },
    onClose: { action: 'onClose clicked' },
  },
};

export const _default = (args) => {
  const [inputValues, setInputValues] = useState({
    excerpt: '',
    title: '',
  });

  const handleUpdateStory = useCallback(({ properties }) => {
    setInputValues((prevVal) => ({
      ...prevVal,
      ...properties,
    }));
  }, []);
  return (
    <StoryContext.Provider
      value={{
        actions: { updateStory: handleUpdateStory },
        state: {
          story: inputValues,
        },
      }}
    >
      <CheckpointContext.Provider
        value={{
          actions: {
            onPublishDialogChecklistRequest: noop,
          },
        }}
      >
        <PublishModal {...args} />
      </CheckpointContext.Provider>
    </StoryContext.Provider>
  );
};
