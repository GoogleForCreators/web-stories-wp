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
 * Internal dependencies
 */
import ConfirmationDialog from '../confirmationDialog';

export default {
  title: 'Stories Editor/Components/Panels/TextStyle/StylePresets/Dialog',
  component: ConfirmationDialog,
  argTypes: {
    onClose: { action: 'closed' },
    onPrimary: { action: 'confirmed' },
  },
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

export const _default = (args) => {
  return <ConfirmationDialog {...args} />;
};
