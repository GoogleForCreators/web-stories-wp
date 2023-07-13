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
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import ArchiveSettings from '..';
import { ARCHIVE_TYPE } from '../../../../constants';

export default {
  title: 'Dashboard/Views/EditorSettings/Archive',
  component: ArchiveSettings,
  argTypes: {
    archive: {
      options: Object.values(ARCHIVE_TYPE),
      control: 'radio',
    },
    updateSettings: { action: 'updateSettings fired' },
  },
  parameters: {
    controls: {
      include: ['updateSettings', 'archive'],
    },
  },
};

export const _default = {
  render: function Render(args) {
    return (
      <FlagsProvider>
        <ArchiveSettings
          archiveURL={'http://www.example.com/web-stories'}
          defaultArchiveURL={'http://www.example.com/web-stories'}
          archivePageId={0}
          getPageById={() => ({ value: 1, label: 'Page 1' })}
          searchPages={() => [
            { value: 1, label: 'Page 1' },
            { value: 1, label: 'Page 2' },
            { value: 1, label: 'Page 3' },
          ]}
          {...args}
        />
      </FlagsProvider>
    );
  },
};
