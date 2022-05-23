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
import { __ } from '@googleforcreators/i18n';
import { Input } from '@googleforcreators/design-system';
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';
import ProductDropdown from '../../../library/panes/shopping/productDropdown';
import { getCommonValue } from '../../shared';
import { noop } from '../../../../utils/noop';

function ProductPanel({ selectedElements, pushUpdate }) {
  const product = getCommonValue(selectedElements, 'product', []);
  const isMultiple = product === MULTIPLE_VALUE;

  const setProduct = useCallback(
    (newProduct) => pushUpdate({ product: newProduct }),
    [pushUpdate]
  );

  // TODO: Provide opportunity to manually override information here.
  return (
    <SimplePanel
      name="product"
      title={__('Product', 'web-stories')}
      collapsedByDefault={false}
    >
      <Row>
        {isMultiple && (
          <Input onChange={noop} disabled value={MULTIPLE_DISPLAY_VALUE} />
        )}
        {!isMultiple && (
          <ProductDropdown
            product={
              isMultiple ? MULTIPLE_DISPLAY_VALUE : selectedElements[0].product
            }
            setProduct={setProduct}
          />
        )}
      </Row>
    </SimplePanel>
  );
}

ProductPanel.propTypes = {
  selectedElements: PropTypes.array,
  pushUpdate: PropTypes.func,
};

export default ProductPanel;
