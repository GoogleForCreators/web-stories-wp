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

/**
 * Internal dependencies
 */
import useReorderable from './useReorderable';

const Container = styled.div`
  z-index: 1;
`;

function ReorderableItem({
  children,
  position,
  onStartReordering,
  disabled,
  data,
  ...props
}) {
  const handleStartReordering = useReorderable(
    ({ actions }) => actions.handleStartReordering
  );

  return (
    <Container
      {...(disabled
        ? null
        : {
            onPointerDown: handleStartReordering({
              position,
              onStartReordering,
              data,
            }),
          })}
      {...props}
    >
      {children}
    </Container>
  );
}

ReorderableItem.propTypes = {
  children: PropTypes.node,
  position: PropTypes.number.isRequired,
  onStartReordering: PropTypes.func,
  disabled: PropTypes.bool,
  data: PropTypes.object,
};

export default ReorderableItem;
