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

const Container = styled.div`
  margin-top: 10px;
`;

const Thumbnail = styled.img`
  height: 66px;
  width: 44px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  object-fit: cover;
  object-position: 50% 50%;
`;

export function VideoOptimization({ element }) {
  return (
    <Container>
      <Thumbnail
        src={element.resource?.poster}
        alt={element.resource?.alt}
        crossOrigin="anonymous"
      />
    </Container>
  );
}

VideoOptimization.propTypes = {
  element: PropTypes.object,
};
