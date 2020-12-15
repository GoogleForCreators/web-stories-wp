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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SimplePanel } from '../../panel';
import { NarrowSpace } from '../parts/spacers';
import { Row, LeftRow } from '../parts/rows';

import FontFamily from '../controls/fontFamily';
import FontWeight from '../controls/fontWeight';
import FontSize from '../controls/fontSize';
import FontStyling from '../controls/fontStyling';
import FontLineHeight from '../controls/fontLineHeight';
import FontLetterSpacing from '../controls/fontLetterSpacing';
import FontColor from '../controls/fontColor';
import TextAlignment from '../controls/textAlignment';
import TextBackground from '../controls/textBackground';
import TextPadding from '../controls/textPadding';

function TextStylePanel() {
  return (
    <SimplePanel name="textstyle" title={__('Style', 'web-stories')}>
      <FontFamily>
        <FontFamily.HasFonts>
          <Row>
            <FontFamily.Select />
          </Row>
        </FontFamily.HasFonts>
      </FontFamily>
      <Row>
        <FontWeight>
          <FontWeight.HasWeights>
            <FontWeight.Select />
            <NarrowSpace />
          </FontWeight.HasWeights>
        </FontWeight>
        <FontSize />
      </Row>
      <Row>
        <FontLineHeight />
        <NarrowSpace />
        <FontLetterSpacing />
      </Row>
      <Row>
        <TextAlignment>
          <TextAlignment.Left />
          <TextAlignment.Center />
          <TextAlignment.Right />
          <TextAlignment.Justified />
        </TextAlignment>
        <FontStyling>
          <FontStyling.Bold />
          <FontStyling.Italic />
          <FontStyling.Underline />
        </FontStyling>
      </Row>
      <Row>
        <FontColor>
          <FontColor.Label />
          <FontColor.Input />
        </FontColor>
      </Row>
      <TextBackground>
        <LeftRow>
          <TextBackground.ModeLabel />
          <TextBackground.None />
          <TextBackground.Fill />
          <TextBackground.Highlight />
        </LeftRow>
        <TextBackground.HasColor>
          <Row>
            <TextBackground.ColorLabel />
            <TextBackground.ColorInput />
          </Row>
        </TextBackground.HasColor>
      </TextBackground>
      <Row>
        <TextPadding>
          <TextPadding.Label />
          <TextPadding.First />
          <NarrowSpace />
          <TextPadding.Lock />
          <TextPadding.HasSecond>
            <NarrowSpace />
            <TextPadding.Second />
          </TextPadding.HasSecond>
        </TextPadding>
      </Row>
    </SimplePanel>
  );
}

export default TextStylePanel;
