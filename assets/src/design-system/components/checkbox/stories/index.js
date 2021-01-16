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
import Checkbox from '../index';

export default {
  title: 'DesignSystem/Components/Checkbox',
  component: Checkbox,
};

const Header = styled.div`
  p {
    font-family: Google Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
  }
`;

const Container = styled.div`
  display: grid;
  row-gap: 20px;
  padding: 20px 50px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-column: 1 / -1;

  > div {
    display: flex;
    justify-content: center;
  }
`;

export const _default = () => {
  return (
    <Container>
      <Row>
        <Header>
          <p>{'Normal'}</p>
        </Header>
        <Header>
          <p>{'Disable'}</p>
        </Header>
      </Row>
      <Row>
        <div>
          <Checkbox />
        </div>
        <div>
          <Checkbox disabled />
        </div>
      </Row>
      <Row>
        <div>
          <Checkbox checked />
        </div>
        <div>
          <Checkbox checked disabled />
        </div>
      </Row>
    </Container>
  );
};
