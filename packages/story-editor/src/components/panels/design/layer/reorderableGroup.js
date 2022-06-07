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
import { Fragment, memo } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { ReorderableSeparator, ReorderableItem } from '../../../reorderable';
import { LAYER_HEIGHT } from './constants';
import Group from './group';

const LayerSeparator = styled(ReorderableSeparator)`
  height: ${LAYER_HEIGHT}px;
  margin: -${LAYER_HEIGHT / 2}px 0;
  padding: ${LAYER_HEIGHT / 2}px 0;
`;

const ReorderableGroup = memo(function ReorderableLayer({
  groupId,
  position,
  handleStartReordering,
}) {
  return (
    <Fragment key={groupId}>
      <LayerSeparator position={position + 1} />
      <ReorderableItem
        position={position}
        onStartReordering={handleStartReordering(groupId)}
      >
        <Group groupId={groupId} />
      </ReorderableItem>
    </Fragment>
  );
});

ReorderableGroup.propTypes = {
  groupId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  handleStartReordering: PropTypes.func.isRequired,
};

export default ReorderableGroup;
