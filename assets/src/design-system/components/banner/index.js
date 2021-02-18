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
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { Cross } from '../../icons';
import { THEME_CONSTANTS } from '../../theme';
import { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from '../button';
import { Headline } from '../typography';

const Title = styled(Headline)`
  grid-area: title;
  font-weight: 700;
  padding-left: 8px;
`;

const Content = styled.div`
  grid-area: content;
  margin-bottom: 4px;
  max-width: 408px;
  min-width: 50%;
`;

const CloseButton = styled(Button)`
  grid-area: closeButton;
  justify-self: end;
  align-self: flex-start;
`;

const Container = styled.div`
  box-sizing: border-box;
  display: grid;
  width: 100%;
  min-height: 60px;
  grid-template-columns: 104px 1fr auto;
  grid-column-gap: 32px;
  grid-template-areas: 'title content closeButton';
  align-items: baseline;
  padding: 6px 8px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  background-image: url('${({ backgroundUrl }) => backgroundUrl}');
  border-radius: ${({ theme }) => theme.borders.radius.medium};

  ${({ isDashboard }) =>
    isDashboard &&
    css`
      max-height: 184px;
      border-radius: 0;
      grid-template-columns: 1fr 32px;
      grid-template-rows: 3;
      grid-column-gap: 0;
      grid-template-areas: '. closeButton' 'title title' 'content content';
      text-align: center;

      ${Title} {
        padding-left: 0;
        margin-top: -10px;
        font-weight: ${({ theme }) => theme.typography.weight.bold};
      }
      ${Content} {
        margin: 8px auto 18px;
        max-width: 480px;
      }
    `}
`;

export const Banner = forwardRef(
  (
    {
      backgroundUrl,
      children,
      closeButtonLabel,
      isDashboard,
      title,
      onClose,
      ...rest
    },
    ref
  ) => {
    return (
      <Container
        ref={ref}
        backgroundUrl={backgroundUrl}
        isDashboard={isDashboard}
        {...rest}
      >
        <Title
          as="h2"
          size={
            THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES[
              isDashboard ? 'X_SMALL' : 'XX_SMALL'
            ]
          }
        >
          {title}
        </Title>
        <CloseButton
          type={BUTTON_TYPES.TERTIARY}
          variant={BUTTON_VARIANTS.SQUARE}
          size={BUTTON_SIZES.SMALL}
          aria-label={closeButtonLabel}
          onClick={onClose}
        >
          <Cross aria-hidden={true} />
        </CloseButton>
        <Content>{children}</Content>
      </Container>
    );
  }
);

Banner.displayName = 'Banner';

Banner.propTypes = {
  children: PropTypes.node.isRequired,
  closeButtonLabel: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  backgroundUrl: PropTypes.string,
  isDashboard: PropTypes.bool,
};
