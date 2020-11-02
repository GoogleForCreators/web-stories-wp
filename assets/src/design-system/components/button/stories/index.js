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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Headline, Text } from '../../';
import { Close } from '../../../icons';
import { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from '..';

export default {
  title: 'DesignSystem/Components/Button',
};

const Container = styled.div`
  display: flex;
  align-items: space-evenly;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  & > div {
    width: 200px;
    margin: 10px;
    p {
      padding-top: 10px;
    }
  }
`;

export const _default = () => {
  return (
    <Container>
      <Headline as="h2">{'Buttons by Variant, Size, and Type'}</Headline>
      {Object.values(BUTTON_VARIANTS).map((buttonVariant) => {
        const buttonContent =
          buttonVariant === BUTTON_VARIANTS.RECTANGLE ? (
            'Standard Button'
          ) : (
            <Close />
          );

        return Object.values(BUTTON_SIZES).map((buttonSize) => (
          <Row key={`${buttonVariant}_${buttonSize}_row_storybook`}>
            {Object.values(BUTTON_TYPES).map((buttonType) => (
              <div
                key={`${buttonVariant}_${buttonSize}_${buttonType}_storybook`}
              >
                <Button
                  key={`${buttonVariant}_${buttonType}_storybook`}
                  variant={buttonVariant}
                  type={buttonType}
                  size={buttonSize}
                >
                  {buttonContent}
                </Button>
                <Text>
                  {`variant: ${buttonVariant}`} <br />
                  {`size: ${buttonSize}`} <br />
                  {`type: ${buttonType}`}
                </Text>
              </div>
            ))}
          </Row>
        ));
      })}
      <Row>
        <div>
          <Button type={BUTTON_TYPES.PRIMARY} href="">
            {'Link as Button'}
          </Button>
          <Text>{'Link as Button'}</Text>
        </div>
      </Row>
    </Container>
  );
};
