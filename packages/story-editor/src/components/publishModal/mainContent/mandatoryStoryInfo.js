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
 * External dependencies
 */
import {
  Headline,
  TextArea,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';

const FormSection = styled.div`
  margin: 20px 0 22px;
`;

const _TextArea = styled(TextArea)`
  margin: 8px 0;
`;

const MandatoryStoryInfo = () => {
  return (
    <>
      <FormSection>
        <Headline
          as="label"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
          htmlFor="story-title"
        >
          {__('Story Title', 'web-stories')}
        </Headline>
        <_TextArea
          name="story-title"
          id="story-title"
          showCount
          maxLength={300}
          value="The best places for a California sunset"
        />
      </FormSection>
      <FormSection>
        <Headline
          as="label"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
          htmlFor="story-description"
        >
          {__('Story Description', 'web-stories')}
        </Headline>
        <_TextArea
          name="story-description"
          id="story-description"
          showCount
          maxLength={100}
          value=""
          placeholder={__('Write an excerpt', 'web-stories')}
          hint={__(
            'Stories with excerpts tend to do better on search and have a wider reach',
            'web-stories'
          )}
        />
      </FormSection>
    </>
  );
};

export default MandatoryStoryInfo;
