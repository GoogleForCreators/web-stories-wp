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
import { Close } from '../../icons';
import { THEME_CONSTANTS } from '../../theme';
import { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS } from '../button';
import { Text } from '../typography';

const Title = styled(Text)`
  grid-area: title;
  font-weight: 600;
  padding-left: 8px;
`;

const Content = styled.div`
  grid-area: content;
  padding-top: 4px;
  margin-bottom: 4px;
`;

const CloseButton = styled(Button)`
  grid-area: closeButton;
  justify-self: end;
  margin: 2px 0 0;
`;

// TODO update this once new theme colors are merged
const Container = styled.div`
  box-sizing: border-box;
  display: grid;
  width: 100%;
  max-height: 60px;
  grid-template-columns: 104px 408px auto;
  grid-column-gap: 32px;
  grid-template-areas: 'title content closeButton';
  padding: 6px 8px;
  background-color: ${({ theme }) => theme.colors.gray[10]};
  background-image: url('${({ backgroundUrl }) => backgroundUrl}');

  ${({ isDashboard }) =>
    isDashboard &&
    css`
      max-height: 164px;
      grid-template-columns: 1fr 32px;
      grid-template-rows: 3;
      grid-column-gap: 0;
      grid-template-areas: '. closeButton' 'title title' 'content content';
      text-align: center;

      ${Title} {
        margin-top: -16px;
        padding-left: 0;
        font-weight: normal;
      }
      ${Content} {
        margin: 8px 0 18px;
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
        <Title size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.LARGE}>
          {title}
        </Title>
        <CloseButton
          type={BUTTON_TYPES.PLAIN}
          variant={BUTTON_VARIANTS.ICON}
          size={BUTTON_SIZES.SMALL}
          aria-label={closeButtonLabel}
          onClick={onClose}
        >
          <Close aria-hidden={true} />
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
