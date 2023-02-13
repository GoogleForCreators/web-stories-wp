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
import { forwardRef } from '@googleforcreators/react';
import type { ForwardedRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Cross } from '../../icons';
import { TextSize } from '../../theme';
import { Button, ButtonSize, ButtonType, ButtonVariant } from '../button';
import { Headline } from '../typography';

const Title = styled(Headline)`
  grid-area: title;
  padding-left: 8px;
`;

const Content = styled.div`
  grid-area: content;
  margin-bottom: 4px;
  max-width: 600px;
  min-width: 50%;
`;

const CloseButton = styled(Button)`
  grid-area: closeButton;
  justify-self: end;
  align-self: flex-start;
`;

const Container = styled.div`
  display: grid;
  width: 100%;
  min-height: 60px;
  grid-template-columns: 104px 1fr auto;
  grid-column-gap: 32px;
  grid-template-areas: 'title content closeButton';
  align-items: baseline;
  padding: 6px 8px;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.borders.radius.medium};

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
  }
  ${Content} {
    margin: 8px auto 18px;
    max-width: 600px;
  }
`;

interface BannerProps {
  closeButtonLabel: string;
  title: string;
  onClose: () => void;
}

const Banner = forwardRef(
  (
    {
      children,
      closeButtonLabel,
      title,
      onClose,
      ...rest
    }: PropsWithChildren<BannerProps>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <Container ref={ref} {...rest}>
        <Title as="h2" size={TextSize.XSmall}>
          {title}
        </Title>
        <CloseButton
          type={ButtonType.Tertiary}
          variant={ButtonVariant.Square}
          size={ButtonSize.Small}
          aria-label={closeButtonLabel}
          onClick={onClose}
        >
          <Cross aria-hidden />
        </CloseButton>
        <Content>{children}</Content>
      </Container>
    );
  }
);

export default Banner;
