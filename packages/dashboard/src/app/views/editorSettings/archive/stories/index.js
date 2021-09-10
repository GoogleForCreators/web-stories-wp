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

/**
 * External dependencies
 */
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import ArchiveSettings from '..';
import { ARCHIVE_TYPE } from '../../../../../constants';

export default {
  title: 'Dashboard/Views/EditorSettings/Archive',
  component: ArchiveSettings,
};

export const _default = () => {
  return (
    <FlagsProvider features={{ disableArchive: true }}>
      <ArchiveSettings
        archive={select('archive', Object.values(ARCHIVE_TYPE))}
        archiveURL={'http://www.example.com/web-stories'}
        updateSettings={action('updateSettings fired')}
      />
    </FlagsProvider>
  );
};
