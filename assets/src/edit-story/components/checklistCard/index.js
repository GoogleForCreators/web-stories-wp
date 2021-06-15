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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Headline, Text, THEME_CONSTANTS } from '../../../design-system';

const Wrapper = styled.div`
  width: 272px;
  display: flex;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bg.secondary};
`;
const Container = styled.div`
  width: 240px;
  display: grid;
  margin: 16px;
  grid-gap: 8px;
  grid-template-columns: 180px 52px;
  grid-template-areas: 'title thumbnail' 'cta thumbnail' 'helper helper';
`;
const Title = styled(Headline).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL,
})`
  grid-area: title;
`;
const Cta = styled.div`
  grid-area: cta;
  margin: 0;
`;
const ThumbnailWrapper = styled.div`
  grid-area: thumbnail;
`;
const Helper = styled.div`
  grid-area: helper;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider.primary};
`;

const SingleIssueCard = ({ title, helper, cta, Thumbnail }) => {
  return (
    <Wrapper>
      <Container>
        <Title>{title}</Title>
        <ThumbnailWrapper>{Thumbnail}</ThumbnailWrapper>
        <Cta>{cta}</Cta>
        <Helper>{helper}</Helper>
      </Container>
    </Wrapper>
  );
};

export default SingleIssueCard;
