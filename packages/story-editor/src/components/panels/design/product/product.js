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
import { __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function ProductPanel({ selectedElements }) {
  if (selectedElements.length !== 1) {
    return null;
  }

  return (
    <SimplePanel
      name="product"
      title={__('Product', 'web-stories')}
      collapsedByDefault={false}
    >
      <Row>
        <HelperText>
          {'TODO: Provide opportunity to manually override information here.'}
        </HelperText>
      </Row>
    </SimplePanel>
  );
}

ProductPanel.propTypes = {
  selectedElements: PropTypes.array,
};

export default ProductPanel;
