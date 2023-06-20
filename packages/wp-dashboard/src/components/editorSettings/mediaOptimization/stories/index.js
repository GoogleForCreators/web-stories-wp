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
 * Internal dependencies
 */
import MediaOptimizationSettings from '..';

export default {
  title: 'Dashboard/Views/EditorSettings/MediaOptimization',
  component: MediaOptimizationSettings,
  args: {
    disabled: false,
    selected: true,
  },
  argTypes: {
    onCheckboxSelected: { action: 'onCheckboxSelected fired' },
  },
};

export const _default = {
  render: function Render(args) {
    return <MediaOptimizationSettings {...args} />;
  },
};
