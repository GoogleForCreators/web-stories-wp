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
import { Icons } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import useAlignment from '../../panels/design/alignment/useAlignment';
import { IconButton, Separator } from './shared';

function ElementAlignment() {
  const { selectedElements, updateSelectedElements } = useStory(
    ({ state: { selectedElements }, actions: { updateSelectedElements } }) => ({
      selectedElements,
      updateSelectedElements,
    })
  );

  const updateElements = (callback) =>
    updateSelectedElements({ properties: callback });

  const {
    isDistributionEnabled,
    handleAlignLeft,
    handleAlignCenter,
    handleAlignRight,
    handleAlignTop,
    handleAlignMiddle,
    handleAlignBottom,
    handleHorizontalDistribution,
    handleVerticalDistribution,
  } = useAlignment({ selectedElements, updateElements });
  return (
    <>
      <IconButton
        Icon={Icons.AlignLeft}
        title={__('Align left', 'web-stories')}
        onClick={handleAlignLeft}
      />
      <IconButton
        Icon={Icons.AlignCenter}
        title={__('Align center', 'web-stories')}
        onClick={handleAlignCenter}
      />
      <IconButton
        Icon={Icons.AlignRight}
        title={__('Align right', 'web-stories')}
        onClick={handleAlignRight}
      />
      <IconButton
        Icon={Icons.AlignTop}
        title={__('Align top', 'web-stories')}
        onClick={handleAlignTop}
      />
      <IconButton
        Icon={Icons.AlignMiddle}
        title={__('Align middle', 'web-stories')}
        onClick={handleAlignMiddle}
      />
      <IconButton
        Icon={Icons.AlignBottom}
        title={__('Align bottom', 'web-stories')}
        onClick={handleAlignBottom}
      />
      {isDistributionEnabled && (
        <>
          <Separator />
          <IconButton
            Icon={Icons.DistributeHorizontal}
            title={__('Distribute horizontally', 'web-stories')}
            onClick={handleHorizontalDistribution}
          />
          <IconButton
            Icon={Icons.DistributeVertical}
            title={__('Distribute vertically', 'web-stories')}
            onClick={handleVerticalDistribution}
          />
        </>
      )}
    </>
  );
}

export default ElementAlignment;
