/*
 * Copyright 2022 Google LLC
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
import { memo, useCallback } from '@googleforcreators/react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Separator, Dismiss, Trash, Settings } from '../elements';
import { useStory } from '../../../app/story';
import { useConfig } from '../../../app/config';
import ProductDropdown from '../../library/panes/shopping/productDropdown';

const StyledDropDown = styled(ProductDropdown)`
  width: 240px;
`;

const FloatingProductMenu = memo(function FloatingProductMenu() {
  const { selectedElement, updateSelectedElements, deleteSelectedElements } =
    useStory(({ actions, state }) => ({
      updateSelectedElements: actions.updateSelectedElements,
      selectedElement: state.selectedElements[0],
      deleteSelectedElements: actions.deleteSelectedElements,
    }));

  const { shoppingProvider } = useConfig();
  const isShoppingEnabled = 'none' !== shoppingProvider;

  const setProduct = useCallback(
    (product) => updateSelectedElements({ properties: { product } }),
    [updateSelectedElements]
  );

  return (
    <>
      {isShoppingEnabled && (
        <>
          <StyledDropDown
            product={selectedElement?.product}
            setProduct={setProduct}
          />
          <Separator />
        </>
      )}
      <Trash
        title={__('Remove product', 'web-stories')}
        handleRemove={deleteSelectedElements}
      />
      <Settings />
      <Dismiss />
    </>
  );
});

export default FloatingProductMenu;
