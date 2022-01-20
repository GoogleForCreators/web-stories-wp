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
import InlineInputForm from '..';

export default {
  title: 'Dashboard/Components/InlineInputForm',
  component: InlineInputForm,
  args: {
    error: 'error',
  },
  argTypes: {
    onEditCancel: {
      action: 'onEditCancel',
    },
    onEditComplete: {
      action: 'onEditComplete',
    },
  },
  parameters: {
    controls: {
      include: ['error', 'onEditCancel', 'onEditComplete'],
    },
  },
};

export const _default = (args) => (
  <InlineInputForm
    onEditComplete={(newValue) => args.onEditComplete(newValue)}
    value={'some input value'}
    id={'898989'}
    label="my hidden input label"
    {...args}
  />
);
