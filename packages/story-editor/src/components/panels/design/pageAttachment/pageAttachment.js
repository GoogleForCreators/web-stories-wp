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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { ELEMENT_TYPES } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app';
import { SimplePanel } from '../../panel';
import Outlink from './outlink';
import ShoppingAttachment from './shoppingAttachment';

function PageAttachmentPanel() {
  const {
    pageAttachment,
    shoppingAttachment,
    updateCurrentPageProperties,
    hasProducts,
  } = useStory(({ state, actions }) => ({
    updateCurrentPageProperties: actions.updateCurrentPageProperties,
    currentPage: state.currentPage,
    pageAttachment: state.currentPage.pageAttachment || {},
    shoppingAttachment: state.currentPage.shoppingAttachment || {},
    hasProducts: state.currentPage.elements?.some(
      ({ type, product }) =>
        type === ELEMENT_TYPES.PRODUCT && product?.productId
    ),
  }));

  const updateShoppingAttachment = useCallback(
    (value) => {
      updateCurrentPageProperties({
        properties: {
          shoppingAttachment: {
            ...shoppingAttachment,
            ...value,
          },
        },
      });
    },
    [updateCurrentPageProperties, shoppingAttachment]
  );

  const updatePageAttachment = useCallback(
    (value) => {
      updateCurrentPageProperties({
        properties: {
          pageAttachment: {
            ...pageAttachment,
            ...value,
          },
        },
      });
    },
    [updateCurrentPageProperties, pageAttachment]
  );

  return (
    <SimplePanel
      name="pageAttachment"
      title={__('Call to Action', 'web-stories')}
      collapsedByDefault={false}
    >
      {hasProducts && (
        <ShoppingAttachment
          shoppingAttachment={shoppingAttachment}
          updateShoppingAttachment={updateShoppingAttachment}
        />
      )}
      {!hasProducts && (
        <Outlink
          pageAttachment={pageAttachment}
          updatePageAttachment={updatePageAttachment}
        />
      )}
    </SimplePanel>
  );
}

export default PageAttachmentPanel;
