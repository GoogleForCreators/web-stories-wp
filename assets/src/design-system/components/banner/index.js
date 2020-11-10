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
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { forwardRef } from 'react';

/**
 * Internal dependencies
 */
import { Close } from '../../icons';
import { THEME_CONSTANTS } from '../../';
import { Button, Text } from '../';
import { BUTTON_TYPES } from '../button';

const Title = styled(Text)`
  grid-area: title;
  font-weight: 600;
`;

const Content = styled.div`
  grid-area: content;
  padding-top: 4px;
  margin-bottom: 4px;
`;

const CloseButton = styled(Button)`
  grid-area: closeButton;
  justify-self: end;
  min-width: 1px;
  width: 32px;
  height: 32px;
  margin: 2px 0 0;
  padding: 9.5px;

  & > svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

// TODO update this once new theme colors are merged
const Container = styled.div`
  box-sizing: border-box;
  display: grid;
  width: 100%;
  max-height: 60px;
  grid-template-columns: 96px 408px auto;
  grid-column-gap: 33px;
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
        font-weight: normal;
      }
      ${Content} {
        margin: 12px 0;
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
      ...props
    },
    ref
  ) => {
    return (
      <Container
        ref={ref}
        backgroundUrl={backgroundUrl}
        isDashboard={isDashboard}
        {...props}
      >
        <Title size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.LARGE}>
          {title}
        </Title>
        <CloseButton
          type={BUTTON_TYPES.PLAIN}
          variant={BUTTON_TYPES.ICON}
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
