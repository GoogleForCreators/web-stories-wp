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
 * Internal dependencies
 */
import getLayerArrangementProps from '../getLayerArrangementProps';
import { LAYER_DIRECTIONS } from '../../../../constants';

describe('getLayerArrangementProps', () => {
  it('should do nothing when more or less than one element is selected', () => {
    expect(
      getLayerArrangementProps(null, null, [{ id: '1' }, { id: '2' }])
    ).toStrictEqual({});
    expect(getLayerArrangementProps(null, null, [])).toStrictEqual({});
  });

  it('should do nothing if irrelevant key is pressed', () => {
    expect(
      getLayerArrangementProps('ArrowLeft', null, [{ id: '1' }])
    ).toStrictEqual({});
  });

  it('should get the layer position as expected within layers without groups', () => {
    const elements = [
      { id: 'a', isBackground: true },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
    ];
    expect(
      getLayerArrangementProps('ArrowUp', false, [{ id: 'b' }], elements)
    ).toStrictEqual({ position: LAYER_DIRECTIONS.FORWARD });
    expect(
      getLayerArrangementProps('ArrowDown', false, [{ id: 'c' }], elements)
    ).toStrictEqual({ position: LAYER_DIRECTIONS.BACKWARD });
  });

  it('should get the layer group and position correctly for first/last layers of the group', () => {
    const elements = [
      { id: 'a', isBackground: true },
      { id: 'b' },
      { id: 'c', groupId: 'g1' },
      { id: 'd', groupId: 'g1' },
      { id: 'e', groupId: 'g2' },
    ];
    // Position stays the same but the layer is moved out of the group.
    expect(
      getLayerArrangementProps(
        'ArrowUp',
        false,
        [{ id: 'd', groupId: 'g1' }],
        elements
      )
    ).toStrictEqual({ position: 3, groupId: null });
    expect(
      getLayerArrangementProps(
        'ArrowDown',
        false,
        [{ id: 'c', groupId: 'g1' }],
        elements
      )
    ).toStrictEqual({ position: 2, groupId: null });
  });

  it('should get the layer group and position correctly when moving an element inside a group', () => {
    const elements = [
      { id: 'a', isBackground: true },
      { id: 'b' },
      { id: 'c', groupId: 'g1' },
      { id: 'd', groupId: 'g1' },
      { id: 'e', groupId: 'g1' },
      { id: 'f' },
    ];
    expect(
      getLayerArrangementProps(
        'ArrowUp',
        false,
        [{ id: 'd', groupId: 'g1' }],
        elements
      )
    ).toStrictEqual({ position: LAYER_DIRECTIONS.FORWARD });
    expect(
      getLayerArrangementProps(
        'ArrowDown',
        false,
        [{ id: 'd', groupId: 'g1' }],
        elements
      )
    ).toStrictEqual({ position: LAYER_DIRECTIONS.BACKWARD });
  });

  it('should get the layer group and position correctly when moving an element into a group', () => {
    const elements = [
      { id: 'a', isBackground: true },
      { id: 'b' },
      { id: 'c', groupId: 'g1' },
      { id: 'd' },
      { id: 'e', groupId: 'g2' },
    ];
    // Position stays the same but the layer is moved out of the group.
    expect(
      getLayerArrangementProps('ArrowUp', false, [{ id: 'd' }], elements)
    ).toStrictEqual({ position: 3, groupId: 'g2' });
    expect(
      getLayerArrangementProps('ArrowDown', false, [{ id: 'd' }], elements)
    ).toStrictEqual({ position: 3, groupId: 'g1' });
  });
});
