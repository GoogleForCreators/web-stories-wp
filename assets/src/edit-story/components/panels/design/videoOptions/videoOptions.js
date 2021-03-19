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
import { Row as DefaultRow } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue } from '../../shared';
import { Checkbox, Text, THEME_CONSTANTS } from '../../../../../design-system';

const Row = styled(DefaultRow)`
  margin-top: 2px;
`;

const Label = styled.label`
  margin-left: 12px;
`;

function VideoOptionsPanel({ selectedElements, pushUpdate }) {
  const loop = getCommonValue(selectedElements, 'loop');

  const checkboxId = `cb-${uuidv4()}`;
  return (
    <SimplePanel
      name="videoOptions"
      title={__('Video settings', 'web-stories')}
    >
      <Row spaceBetween={false}>
        <Checkbox
          id={checkboxId}
          checked={loop}
          onChange={(evt) => pushUpdate({ loop: evt.target.checked }, true)}
        />
        <Label htmlFor={checkboxId}>
          <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__('Loop', 'web-stories')}
          </Text>
        </Label>
      </Row>
    </SimplePanel>
  );
}

VideoOptionsPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default VideoOptionsPanel;
