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
import { DesertColor } from '@googleforcreators/design-system';

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 20vh auto;

  & > * {
    text-align: center;
    margin: 0 auto;
  }

  /* Sometimes children will contain button or anchor as cta. */
  button,
  a {
    margin-top: 48px;
  }
`;

const EmptyImage = styled(DesertColor)`
  margin-bottom: 48px;
`;
function EmptyContentMessage({ children }) {
  return (
    <Message>
      <EmptyImage aria-hidden width={274} height={118} />
      {children}
    </Message>
  );
}

EmptyContentMessage.propTypes = {
  children: PropTypes.node,
};

export default EmptyContentMessage;
