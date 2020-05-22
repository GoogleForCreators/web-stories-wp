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
import { useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import debounce from '../../utils/debounce';

const List = styled.ul.attrs({ role: 'listbox' })`
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none auto;
`;

const Item = styled.li.attrs({
  tabIndex: '0',
  role: 'option',
})`
  overflow: hidden;
`;

function ScrollList({ items, itemRenderer, onScroll, className }) {
  const ref = useRef();
  const itemOffsets = useRef([]);
  const numItems = items.length;

  const setOffset = useCallback(
    (index) => (node) => {
      if (!node) {
        return;
      }
      itemOffsets.current[index] = node.offsetTop;
    },
    []
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const handleScroll = debounce((evt) => {
      if (!evt.target) {
        return;
      }
      const {
        target: { scrollTop, clientHeight },
      } = evt;
      const firstIndexInView = itemOffsets.current.findIndex(
        (y) => y > scrollTop
      );
      const firstIndexOutOfView = itemOffsets.current.findIndex(
        (y) => y > scrollTop + clientHeight
      );
      const lastIndexInView =
        firstIndexOutOfView === -1 ? numItems : firstIndexOutOfView - 1;
      onScroll(firstIndexInView, lastIndexInView);
    }, 100);

    // Invoke now
    handleScroll({ target: node });
    // And when scroll changes (but debounced)
    node.addEventListener('scroll', handleScroll);
    return () => node.removeEventListener('scroll', handleScroll);
  }, [onScroll, numItems]);

  // Trim to current length of list
  useEffect(() => {
    itemOffsets.current = itemOffsets.current.slice(0, numItems);
  }, [numItems]);

  return (
    <List
      className={className}
      aria-multiselectable={false}
      aria-required={false}
      ref={ref}
    >
      {items.map((item, index) => (
        <Item ref={setOffset(index)} key={index}>
          {itemRenderer(item)}
        </Item>
      ))}
    </List>
  );
}

ScrollList.propTypes = {
  items: PropTypes.array.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ScrollList;
