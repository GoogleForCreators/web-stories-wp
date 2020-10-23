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
import { Arrow, Chevron, Close, Edit } from '../../../icons';

import { Button } from '../../../components';
export default {
  title: 'DesignSystem/Components/Button',
};

const Container = styled.div`
  display: flex;
  align-items: space-evenly;
  flex-wrap: wrap;
  & > * {
    margin: 10px;
  }
`;

export const _default = () => {
  return (
    <Container>
      <Button>{'test button'}</Button>
      <Button type="primary">{'primary button'}</Button>
      <Button type="primary" href="#">
        {'link as a button'}
      </Button>
      <Button type="primary">{'really really long primary button'}</Button>
      <Button type="secondary">{'secondary button'}</Button>
      <Button type="tertiary">{'tertiary button'}</Button>
      <Button type="primary" disabled>
        {'primary button disabled'}
      </Button>
      <Button variant="circle">
        <Close />
      </Button>
      <Button variant="circle" type="primary">
        <Arrow />
      </Button>
      <Button variant="circle" type="secondary">
        <Chevron />
      </Button>
      <Button variant="circle" type="tertiary">
        <Arrow />
      </Button>

      <Button variant="circle" size="small">
        <Arrow />
      </Button>
      <Button variant="circle" size="small" type="primary">
        <Arrow />
      </Button>
      <Button variant="circle" size="small" type="secondary">
        <Arrow />
      </Button>
      <Button variant="circle" size="small" type="tertiary">
        <Arrow />
      </Button>
      <Button variant="circle" size="small" type="primary" disabled>
        <Arrow />
      </Button>

      <Button variant="icon" size="small">
        <Edit />
      </Button>
      <Button variant="icon" size="medium">
        <Edit />
      </Button>
    </Container>
  );
};
