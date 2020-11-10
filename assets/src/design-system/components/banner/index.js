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
import styled from 'styled-components';
import { forwardRef } from 'react';

/**
 * Internal dependencies
 */
import { Close } from '../../icons';
import { THEME_CONSTANTS } from '../../';
import { Button, Headline } from '../';
import { BUTTON_TYPES } from '../button';

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 1px solid red;
`;

const CloseButton = styled(Button)`
  align-self: flex-end;
  color: black;
  margin: 0;
  min-width: 1px;
  width: 32px;
  height: 32px;

  & > svg {
    width: 13px;
    height: 13px;
  }
`;

export const Banner = forwardRef(
  (
    { backgroundUrl, closeButtonLabel, children, title, onClose, ...props },
    ref
  ) => {
    return (
      <Container ref={ref} {...props}>
        <CloseButton
          type={BUTTON_TYPES.PLAIN}
          variant={BUTTON_TYPES.ICON}
          aria-label={closeButtonLabel}
        >
          <Close aria-hidden={true} />
        </CloseButton>
        <Headline>{title}</Headline>
        {children}
      </Container>
    );
  }
);

Banner.displayName = 'Banner';

Banner.propTypes = {
  backgroundUrl: PropTypes.string,
  closeButtonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
