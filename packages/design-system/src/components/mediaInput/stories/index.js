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
import styled, { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import { theme, THEME_CONSTANTS } from '../../../theme';
import { MediaInput as DefaultMediaInput } from '..';
import { shortDropDownOptions } from '../../../storybookUtils/sampleData';
import { MEDIA_VARIANTS } from '../constants';
import { Headline } from '../../typography/headline';
import { Text } from '../../typography/text';
import image from './image.jpg';

export default {
  title: 'DesignSystem/Components/MediaInput',
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.secondary};
  width: 600px;
  padding: 30px;
`;

const Row = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: space-evenly;
`;

const MediaInput = styled(DefaultMediaInput)`
  width: 64px;
  height: 114px;
`;

const CircleMedia = styled(DefaultMediaInput)`
  width: 64px;
  height: 64px;
`;

const mediaProps = {
  onChange: () => {},
  openMediaPicker: () => {},
  onMenuOption: () => {},
};

// Override light theme because this component is only set up for dark theme right now
export const _default = () => (
  <ThemeProvider theme={theme}>
    <Container>
      <Headline as="h3" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {'Media Input demos'}
      </Headline>
      <Row>
        <div>
          <Text>
            {'variant: rectangle'} <br />
            {'with image'}
          </Text>
          <MediaInput
            value={image}
            variant={MEDIA_VARIANTS.RECTANGLE}
            menuOptions={shortDropDownOptions}
            {...mediaProps}
          />
        </div>
        <div>
          <Text>
            {'variant: circle'} <br />
            {'with image'}
          </Text>
          <CircleMedia
            value={image}
            variant={MEDIA_VARIANTS.CIRCLE}
            menuOptions={shortDropDownOptions}
            {...mediaProps}
          />
        </div>
      </Row>
      <Row>
        <div>
          <Text>
            {'variant: rectangle'} <br />
            {'without image'}
          </Text>
          <MediaInput
            value={null}
            variant={MEDIA_VARIANTS.RECTANGLE}
            menuOptions={shortDropDownOptions}
            {...mediaProps}
          />
        </div>
        <div>
          <Text>
            {'variant: circle'} <br />
            {'without image'}
          </Text>
          <CircleMedia
            value={null}
            variant={MEDIA_VARIANTS.CIRCLE}
            menuOptions={shortDropDownOptions}
            {...mediaProps}
          />
        </div>
      </Row>
      <Row>
        <div>
          <Text>
            {'variant: rectangle'} <br />
            {'no menu'}
          </Text>
          <MediaInput
            value={image}
            variant={MEDIA_VARIANTS.RECTANGLE}
            {...mediaProps}
          />
        </div>
        <div>
          <Text>
            {'variant: rectangle'} <br />
            {'no menu'}
          </Text>
          <CircleMedia
            value={image}
            variant={MEDIA_VARIANTS.CIRCLE}
            {...mediaProps}
          />
        </div>
      </Row>
    </Container>
  </ThemeProvider>
);
