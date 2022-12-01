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

export interface FontProviderState {
  state: {
    fonts: FontData[];
    curatedFonts: FontData[];
    customFonts: FontData[];
    recentFonts: FontData[];
  };
  actions: {
    getFontsBySearch: () => FontData[];
    getFontByName: () => FontData | null;
    maybeEnqueueFontStyle: () => void;
    getFontWeight: () => FontWeight;
    getFontFallback: () => string;
    ensureMenuFontsLoaded: () => void;
    ensureCustomFontsLoaded: () => void;
    addRecentFont: (font: FontData) => void;
    getCustomFonts: () => FontData[];
    getCuratedFonts: () => FontData[];
  };
}
