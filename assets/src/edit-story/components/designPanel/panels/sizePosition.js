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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SimplePanel } from '../../panel';
import { Row } from '../parts/rows';
import { ToggleSpace, NarrowSpace } from '../parts/spacers';
import Size from '../controls/size';
import Position from '../controls/position';
import Rotation from '../controls/rotation';
import Flip from '../controls/flip';

function SizePositionPanel() {
  return (
    <SimplePanel
      name="sizeposition"
      title={__('Size & Position', 'web-stories')}
    >
      <Row>
        <Position>
          <Position.X />
          <NarrowSpace />
          <ToggleSpace />
          <NarrowSpace />
          <Position.Y />
        </Position>
      </Row>
      <Row>
        <Size>
          <Size.Width />
          <NarrowSpace />
          <Size.LockAspectRatio />
          <NarrowSpace />
          <Size.Height />
        </Size>
      </Row>
      <Row expand={false}>
        <Rotation />
        <Flip>
          <Flip.IsPossible>
            <Flip.Group>
              <Flip.Vertical />
              <NarrowSpace />
              <Flip.Horizontal />
            </Flip.Group>
          </Flip.IsPossible>
        </Flip>
      </Row>
    </SimplePanel>
  );
}

export default SizePositionPanel;
