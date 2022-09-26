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
import { ConfigContext } from '../../../app/config';
import { StoryContext } from '../../../app/story';
import EditLayerFocusManager from '../../canvas/editLayerFocusManager';
import FloatingMenu from '../menu';

export default {
  title: 'Stories Editor/Components/FloatingMenu',
  component: FloatingMenu,
  args: {
    selectedElementType: 'image',
    selectionIdentifier: 'a1d51657-6c26-43b6-9571-a5f1de0dcbd9',
    visuallyHidden: false,
    ref: { current: {} }, // current just needs to be truthy for menu to render in storybook
  },
  argTypes: {
    handleDismiss: { action: 'dismissed' },
    selectedElementType: {
      options: ['image', 'shape', 'sticker'],
      control: { type: 'select' },
    },
  },
  parameters: {
    controls: {
      exclude: [
        'selectionIdentifier',
        'visuallyHidden',
        'ref',
        'handelDismiss',
      ],
    },
  },
};

export const _default = (args) => {
  return (
    <ConfigContext.Provider
      value={{
        capabilities: {
          hasUploadMediaAction: true,
        },
      }}
    >
      <StoryContext.Provider
        value={{
          state: {
            story: {},
            selectedElements: [
              {
                type: args.selectedElementType,
                flip: 'horizontal',
                resource: {},
                id: 'some-element-id',
              },
            ],
          },
          actions: { updateSelectedElements: () => {} },
        }}
      >
        <EditLayerFocusManager>
          <FloatingMenu {...args} />
        </EditLayerFocusManager>
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );
};
