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
import { __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';
import { Text, THEME_CONSTANTS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { usePresubmitHandler } from '../../../form';
import getUpdatedSizeAndPosition from '../../../../utils/getUpdatedSizeAndPosition';
import BackgroundColorControls from './backgroundColor';
import PaddingControls from './padding';

const SubHeading = styled.div``;
const Container = styled.section``;

function TextBox(props) {
  // Update size and position if relevant values have changed.
  usePresubmitHandler(getUpdatedSizeAndPosition, []);

  const title = __('Text box', 'web-stories');
  return (
    <Container aria-label={title}>
      <SubHeading>
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {title}
        </Text>
      </SubHeading>
      <BackgroundColorControls {...props} />
      <PaddingControls {...props} />
    </Container>
  );
}

export default TextBox;
