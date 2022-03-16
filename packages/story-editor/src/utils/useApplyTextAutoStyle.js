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
import { getHTMLFormatters } from '@googleforcreators/rich-text';

/**
 * Internal dependencies
 */
import { BACKGROUND_TEXT_MODE } from '../constants';
import { useCalculateAccessibleTextColors } from '../app/pageCanvas';
import { applyHiddenPadding } from '../components/panels/design/textStyle/utils';

function useApplyTextAutoStyle(element, updater) {
  const htmlFormatters = getHTMLFormatters();
  const { setColor } = htmlFormatters;
  const calculateAccessibleTextColors = useCalculateAccessibleTextColors();

  const applyTextAutoStyle = async () => {
    const autoColor = await calculateAccessibleTextColors(element);
    const { color: fgColor, backgroundColor } = autoColor;
    if (backgroundColor || fgColor) {
      const highlightProps = backgroundColor
        ? {
            backgroundColor: { color: backgroundColor },
            backgroundTextMode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
            padding: applyHiddenPadding(element),
          }
        : null;
      const content = fgColor
        ? setColor(element.content, { color: fgColor })
        : element.content;
      updater({ ...highlightProps, content });
    }
  };

  return applyTextAutoStyle;
}

export default useApplyTextAutoStyle;
