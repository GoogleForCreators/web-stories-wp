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
import { theme, TextSize } from '../../../theme';
import { MediaInput as DefaultMediaInput } from '..';
import { shortDropDownOptions } from '../../../storybookUtils/sampleData';
import { MediaVariant } from '../types';
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

export const _default = {
  render: function Render() {
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Headline as="h3" size={TextSize.Small}>
            {'Media Input demos'}
          </Headline>
          <Row>
            <div>
              <Text.Paragraph>
                {'variant: rectangle'} <br />
                {'with image'}
              </Text.Paragraph>
              <MediaInput
                value={image}
                variant={MediaVariant.Rectangle}
                menuOptions={shortDropDownOptions}
                {...mediaProps}
              />
            </div>
            <div>
              <Text.Paragraph>
                {'variant: circle'} <br />
                {'with image'}
              </Text.Paragraph>
              <CircleMedia
                value={image}
                variant={MediaVariant.Circle}
                menuOptions={shortDropDownOptions}
                {...mediaProps}
              />
            </div>
          </Row>
          <Row>
            <div>
              <Text.Paragraph>
                {'variant: rectangle'} <br />
                {'no edit icon'}
              </Text.Paragraph>
              <MediaInput
                value={image}
                canUpload={false}
                variant={MediaVariant.Rectangle}
                menuOptions={shortDropDownOptions}
                {...mediaProps}
              />
            </div>
            <div>
              <Text.Paragraph>
                {'variant: circle'} <br />
                {'no edit icon'}
              </Text.Paragraph>
              <CircleMedia
                value={image}
                canUpload={false}
                variant={MediaVariant.Circle}
                menuOptions={shortDropDownOptions}
                {...mediaProps}
              />
            </div>
          </Row>
          <Row>
            <div>
              <Text.Paragraph>
                {'variant: rectangle'} <br />
                {'without image'}
              </Text.Paragraph>
              <MediaInput
                value={null}
                variant={MediaVariant.Rectangle}
                menuOptions={shortDropDownOptions}
                {...mediaProps}
              />
            </div>
            <div>
              <Text.Paragraph>
                {'variant: circle'} <br />
                {'without image'}
              </Text.Paragraph>
              <CircleMedia
                value={null}
                variant={MediaVariant.Circle}
                menuOptions={shortDropDownOptions}
                {...mediaProps}
              />
            </div>
          </Row>
          <Row>
            <div>
              <Text.Paragraph>
                {'variant: rectangle'} <br />
                {'no menu'}
              </Text.Paragraph>
              <MediaInput
                value={image}
                variant={MediaVariant.Rectangle}
                {...mediaProps}
              />
            </div>
            <div>
              <Text.Paragraph>
                {'variant: rectangle'} <br />
                {'no menu'}
              </Text.Paragraph>
              <CircleMedia
                value={image}
                variant={MediaVariant.Circle}
                {...mediaProps}
              />
            </div>
          </Row>
        </Container>
      </ThemeProvider>
    );
  },
};
