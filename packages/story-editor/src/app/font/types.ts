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
import type { FontData, FontWeight } from '@googleforcreators/elements';

export interface FontWeightOption {
  name: string;
  value: FontWeight;
}

export interface FontProviderState {
  state: {
    fonts: FontData[];
    curatedFonts: FontData[];
    customFonts: FontData[] | null;
    recentFonts: FontData[];
  };
  actions: {
    getFontsBySearch: (name: string) => Promise<FontData[]>;
    getFontByName: (name: string) => FontData | null;
    maybeEnqueueFontStyle: (fonts: FontConfig[]) => Promise<unknown>;
    getFontWeight: (name: string) => FontWeightOption[];
    getFontFallback: (name: string) => string[];
    ensureMenuFontsLoaded: (fonts: string[]) => void;
    ensureCustomFontsLoaded: (fonts: string[]) => void;
    addRecentFont: (font: FontData) => void;
    getCustomFonts: () => Promise<unknown>;
    getCuratedFonts: () => Promise<unknown>;
  };
}

export interface FontConfig {
  font: FontData;
  fontStyle: 'italic' | 'normal';
  content: string;
  fontWeight?: FontWeight;
}
