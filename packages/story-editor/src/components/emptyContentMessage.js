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
import { DesertBw } from '@googleforcreators/design-system';

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 8vh auto;
  text-align: center;

  * {
    text-align: center;
    margin: 0 auto;
  }
`;

const EmptyImage = styled(DesertBw)`
  margin-bottom: 48px;
`;

function EmptyContentMessage({ children, ...props }) {
  return (
    <Message {...props}>
      <EmptyImage aria-hidden width={274} height={118} />
      {children}
    </Message>
  );
}

EmptyContentMessage.propTypes = {
  children: PropTypes.node,
};

export default EmptyContentMessage;
