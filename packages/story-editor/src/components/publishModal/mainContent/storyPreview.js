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
import { Headline, THEME_CONSTANTS } from '@googleforcreators/design-system';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';

const PreviewContainer = styled.div`
  margin: 8px 0;
  object-fit: contain;
  width: 100%;
  & > img {
    border-radius: ${({ theme }) => theme.borders.radius.medium};
  }
`;

const StoryPreview = () => {
  return (
    <>
      <Headline
        as="label"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
      >
        {__('Cover Preview', 'web-stories')}
      </Headline>
      <PreviewContainer>
        <img src="http://placekitten.com/230/342" alt="" />
      </PreviewContainer>
    </>
  );
};

export default StoryPreview;
