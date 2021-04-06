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
import { __ } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useFeature } from 'flagged';
import { Row as DefaultRow } from '../../../form';
import { SimplePanel } from '../../panel';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
} from '../../../../../design-system';

const Row = styled(DefaultRow)`
  margin-top: 2px;
`;

function VideoProcessingPanel({ selectedElements, pushUpdate }) {
  const isFeatureEnabled = useFeature('videoOptimization');
  if (!isFeatureEnabled) {
    return null;
  }
  if (selectedElements.length > 1) {
    return null;
  }
  return (
    <SimplePanel
      name="VideoProcessing"
      title={__('Video Processing', 'web-stories')}
    >
      <Row spaceBetween={false}>
        <Button
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          onClick={() => {}}
        >
          {__('Reprocess Video', 'web-stories')}
        </Button>
      </Row>
    </SimplePanel>
  );
}

VideoProcessingPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default VideoProcessingPanel;
