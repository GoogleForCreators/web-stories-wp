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
import { object } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import ColorPicker from '../';

export default {
  title: 'Components/Color Picker',
  component: ColorPicker,
};

export const _default = () => {
  const initialColor = object('Initial Color', {
    type: 'linear',
    stops: [
      {
        color: { r: 255, g: 0, b: 0 },
        position: 0,
      },
      {
        color: { r: 0, g: 255, b: 0 },
        position: 0.5,
      },
      {
        color: { r: 0, g: 0, b: 255 },
        position: 1,
      },
    ],
  });

  return <ColorPicker color={initialColor} onChange={() => {}} />;
};
