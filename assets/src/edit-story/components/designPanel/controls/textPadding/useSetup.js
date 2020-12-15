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
import useElementSetup from '../../useElementSetup';
import useCommonProperty from '../../useCommonProperty';

import useCommonFontFamily from './useCommonFontFamily';
import useFonts from './useFonts';
import useRichTextFormatting from './useRichTextFormatting';
import useCommonBackgroundColor from './useCommonBackgroundColor';
import useCommonPadding from './useCommonPadding';
import CONFIG from './config';

function useSetup() {
  const fontFamily = useCommonFontFamily();
  const { fontFamilies, fontWeights } = useFonts();
  const {
    fontWeight,
    letterSpacing,
    fontColor,
    isBold,
    isItalic,
    isUnderline,
  } = useRichTextFormatting();
  const fontSize = useCommonProperty('fontSize');
  const lineHeight = useCommonProperty('lineHeight');
  const textAlign = useCommonProperty('textAlign');
  const backgroundMode = useCommonProperty('backgroundTextMode');
  const backgroundColor = useCommonBackgroundColor();
  const {
    paddingVertical,
    paddingHorizontal,
    paddingLock,
  } = useCommonPadding();

  useElementSetup(
    CONFIG.FONTFAMILY.PROPERTY,
    {
      value: fontFamily,
      options: fontFamilies,
    },
    [fontFamily]
  );

  useElementSetup(
    CONFIG.FONTWEIGHT.PROPERTY,
    {
      value: fontWeight,
      options: fontWeights,
    },
    [fontWeight, fontWeights]
  );

  useElementSetup(
    CONFIG.FONTSIZE.PROPERTY,
    {
      value: fontSize,
      min: CONFIG.FONTSIZE.MIN,
      max: CONFIG.FONTSIZE.MAX,
    },
    [fontSize]
  );

  useElementSetup(
    CONFIG.LINEHEIGHT.PROPERTY,
    {
      value: lineHeight,
      min: CONFIG.LINEHEIGHT.MIN,
      max: CONFIG.LINEHEIGHT.MAX,
    },
    [lineHeight]
  );

  useElementSetup(
    CONFIG.LETTERSPACING.PROPERTY,
    {
      value: letterSpacing,
      min: CONFIG.LETTERSPACING.MIN,
      max: CONFIG.LETTERSPACING.MAX,
    },
    [letterSpacing]
  );

  useElementSetup(
    CONFIG.TEXTALIGN.PROPERTY,
    {
      value: textAlign,
    },
    [textAlign]
  );

  useElementSetup(
    CONFIG.BOLD.PROPERTY,
    {
      value: isBold,
    },
    [isBold]
  );

  useElementSetup(
    CONFIG.ITALIC.PROPERTY,
    {
      value: isItalic,
    },
    [isItalic]
  );

  useElementSetup(
    CONFIG.UNDERLINE.PROPERTY,
    {
      value: isUnderline,
    },
    [isUnderline]
  );

  useElementSetup(
    CONFIG.FONTCOLOR.PROPERTY,
    {
      value: fontColor,
    },
    [fontColor]
  );

  useElementSetup(
    CONFIG.BACKGROUNDMODE.PROPERTY,
    {
      value: backgroundMode,
    },
    [backgroundMode]
  );

  useElementSetup(
    CONFIG.BACKGROUNDCOLOR.PROPERTY,
    {
      value: backgroundColor,
    },
    [backgroundColor]
  );

  useElementSetup(
    CONFIG.PADDINGVERTICAL.PROPERTY,
    {
      value: paddingVertical,
      min: CONFIG.PADDINGVERTICAL.MIN,
      max: CONFIG.PADDINGVERTICAL.MAX,
    },
    [paddingVertical]
  );

  useElementSetup(
    CONFIG.PADDINGHORIZONTAL.PROPERTY,
    {
      value: paddingHorizontal,
      min: CONFIG.PADDINGHORIZONTAL.MIN,
      max: CONFIG.PADDINGHORIZONTAL.MAX,
    },
    [paddingHorizontal]
  );

  useElementSetup(
    CONFIG.PADDINGLOCK.PROPERTY,
    {
      value: paddingLock,
    },
    [paddingLock]
  );
}

export default useSetup;
