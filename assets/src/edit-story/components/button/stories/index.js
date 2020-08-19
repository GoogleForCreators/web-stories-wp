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
import { text, boolean } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import {
  Primary,
  Secondary,
  Outline,
  Undo,
  Redo,
  GridView,
  Close,
  Eyedropper,
  ArrowDown,
} from '../';

export default {
  title: 'Stories Editor/Components/Button',
  component: Primary,
};

export const _default = () => {
  const label = text('Label', 'Primary Button');
  const isDisabled = boolean('Disabled', false);

  return <Primary isDisabled={isDisabled}>{label}</Primary>;
};

export const secondary = () => {
  const label = text('Label', 'Secondary Button');
  const isDisabled = boolean('Disabled', false);

  return <Secondary isDisabled={isDisabled}>{label}</Secondary>;
};

export const outline = () => {
  const label = text('Label', 'Outline Button');
  const isDisabled = boolean('Disabled', false);

  return <Outline isDisabled={isDisabled}>{label}</Outline>;
};

outline.parameters = {
  backgrounds: {
    default: 'Dark',
  },
};

export const undo = () => {
  const isDisabled = boolean('Disabled', false);

  return <Undo isDisabled={isDisabled} />;
};

undo.parameters = {
  backgrounds: {
    default: 'Dark',
  },
};

export const redo = () => {
  const isDisabled = boolean('Disabled', false);

  return <Redo isDisabled={isDisabled} />;
};

redo.parameters = {
  backgrounds: {
    default: 'Dark',
  },
};

export const gridView = () => {
  const isDisabled = boolean('Disabled', false);

  return <GridView isDisabled={isDisabled} />;
};

gridView.parameters = {
  backgrounds: {
    default: 'Dark',
  },
};

export const close = () => {
  const isDisabled = boolean('Disabled', false);

  return <Close isDisabled={isDisabled} />;
};

close.parameters = {
  backgrounds: {
    default: 'Dark',
  },
};

export const eyedropper = () => {
  const isDisabled = boolean('Disabled', false);

  return <Eyedropper isDisabled={isDisabled} />;
};

eyedropper.parameters = {
  backgrounds: {
    default: 'Dark',
  },
};

export const arrowdown = () => {
  const isDisabled = boolean('Disabled', false);

  return <ArrowDown isDisabled={isDisabled} />;
};

arrowdown.parameters = {
  backgrounds: {
    default: 'Dark',
  },
};
