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
import { ConfigContext } from '../../../app/config';
import {
  ChecklistCountProvider,
  CheckpointContext,
  PPC_CHECKPOINT_STATE,
} from '../../checklist';
import SidebarContext from '../../sidebar/context';
import { PageAdvancementPanel, SlugPanel } from '../../panels/document';
import PublishModal from '../publishModal';

const MockDocumentPane = () => (
  <>
    <SlugPanel />
    <PageAdvancementPanel />
  </>
);
export default {
  title: 'Stories Editor/Components/Dialog/Publish Modal',
  args: {
    canPublish: true,
    hasChecklist: true,
    hasFutureDate: false,
    hasPublisherLogo: true,
    hasFeaturedMedia: true,
    hasUploadMediaAction: true,
    hasPriorityIssues: true,
    publishButtonDisabled: true,
    publisher: 'Gotham Bugle',
    isOpen: true,
    isSaving: false,
  },
  argTypes: {
    onPublish: { action: 'onPublish clicked' },
    onClose: { action: 'onClose clicked' },
    onPublishDialogChecklistRequest: {
      action: 'onPublishDialogChecklistRequest clicked',
    },
    checkpoint: {
      options: Object.values(PPC_CHECKPOINT_STATE),
      control: { type: 'select' },
      name: "Checklist's given checkpoint",
    },
    storyStatus: {
      options: ['publish', 'future', 'private', 'draft'],
      control: { type: 'select' },
      name: 'Status of Story',
    },
  },
};

export const _default = (args) => {
  const {
    canPublish,
    checkpoint,
    isSaving,
    hasChecklist,
    hasUploadMediaAction,
    hasFeaturedMedia,
    hasPublisherLogo,
    hasPriorityIssues,
    onPublishDialogChecklistRequest,
    publisher,
    storyStatus,
  } = args;
  const [inputValues, setInputValues] = useState({
    excerpt: '',
    title: '',
    link: 'http://sample.com/post_type=web-story&p=274',
  });

  const handleUpdateStory = useCallback(({ properties }) => {
    setInputValues((prevVal) => ({
      ...prevVal,
      ...properties,
    }));
  }, []);
  return (
    <ConfigContext.Provider
      value={{
        metadata: {
          publisher: publisher,
        },
        capabilities: {
          hasUploadMediaAction: hasUploadMediaAction,
        },
      }}
    >
      <StoryContext.Provider
        value={{
          actions: { updateStory: handleUpdateStory },
          state: {
            capabilities: { publish: canPublish },
            meta: { isSaving: isSaving },
            story: {
              ...inputValues,
              permalinkConfig: {
                prefix: 'http://sample.com/',
                suffix: '',
              },
              featuredMedia: {
                url: hasFeaturedMedia ? 'http://placekitten.com/230/342' : '',
                height: 333,
                width: 250,
              },
              publisherLogo: {
                url: hasPublisherLogo ? 'http://placekitten.com/158/96' : '',
                height: 96,
                width: 158,
              },
              status: storyStatus,
            },
          },
        }}
      >
        <SidebarContext.Provider
          value={{
            actions: {
              loadUsers: () => {},
            },
            data: {
              modalSidebarTab: {
                title: 'document panel',
                DocumentPane: MockDocumentPane,
              },
            },
            state: {
              users: {},
              sidebarContentHeight: 600,
            },
          }}
        >
          <ChecklistCountProvider hasChecklist={hasChecklist}>
            <CheckpointContext.Provider
              value={{
                actions: {
                  onPublishDialogChecklistRequest:
                    onPublishDialogChecklistRequest,
                },
                state: {
                  shouldReviewDialogBeSeen: hasPriorityIssues,
                  checkpoint: checkpoint,
                },
              }}
            >
              <PublishModal {...args} />
            </CheckpointContext.Provider>
          </ChecklistCountProvider>
        </SidebarContext.Provider>
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );
};
