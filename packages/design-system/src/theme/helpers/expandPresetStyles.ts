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
import { css } from 'styled-components';

/**
 * Internal dependencies
 */
import type { Preset } from '../../types/typography';
import type { Theme } from '../theme';
import { TextSize } from '../types';

interface ExpandPresetStylesProps {
  preset?: Preset;
  theme: Theme;
}

export const expandPresetStyles = ({
  preset,
  theme,
}: ExpandPresetStylesProps) =>
  preset
    ? css`
        font-family: ${theme.typography.family.primary};
        font-size: ${preset.size}px;
        font-weight: ${preset.weight};
        letter-spacing: ${preset.letterSpacing}px;
        line-height: ${preset.lineHeight}px;
        text-decoration: none;
      `
    : css``;

type PresetChoices = Theme['typography']['presets'];
type PresetSelector = (
  choices: PresetChoices,
  sizes: typeof TextSize
) => Preset;

export const expandTextPreset =
  (presetSelector: PresetSelector) =>
  ({ theme }: { theme: Theme }) =>
    expandPresetStyles({
      preset: presetSelector(theme.typography.presets, TextSize),
      theme,
    });
