/*
 * Copyright 2021 Google LLC
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
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Modal,
  PLACEMENT,
} from '@googleforcreators/design-system';
import { useCallback, useState } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Tooltip from '../../tooltip';
import GridView from './gridView';

const Box = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function GridViewButton() {
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setIsGridViewOpen((prevIsOpen) => {
      const newIsOpen = !prevIsOpen;

      trackEvent('grid_view_toggled', {
        status: newIsOpen ? 'open' : 'closed',
      });

      return newIsOpen;
    });
  }, [setIsGridViewOpen]);

  return (
    <>
      <Box>
        <Tooltip
          title={__('Grid View', 'web-stories')}
          placement={PLACEMENT.TOP}
          hasTail
        >
          <Button
            variant={BUTTON_VARIANTS.SQUARE}
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onClick={toggleModal}
            aria-label={__('Grid View', 'web-stories')}
          >
            <Icons.Box4 />
          </Button>
        </Tooltip>
      </Box>
      <Modal
        isOpen={isGridViewOpen}
        onClose={toggleModal}
        contentLabel={__('Grid View', 'web-stories')}
        overlayStyles={{
          alignItems: 'stretch',
          backgroundColor: '#131516', // theme.colors.brand.gray[90]
        }}
        contentStyles={{
          pointerEvents: 'none',
          flex: 1,
        }}
      >
        <GridView onClose={toggleModal} />
      </Modal>
    </>
  );
}

export default GridViewButton;
