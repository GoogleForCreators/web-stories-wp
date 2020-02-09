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

/**
 * Internal dependencies
 */
import ReorderableProvider from './provider';

function ReorderableList({
  className,
  items,
  onSelection,
  onReorderItem,
  itemRenderer: Item,
  canSelectMultiple,
  isReversed,
  ...rest
}) {
  const clonedItems = items.concat();
  if (isReversed) {
    clonedItems.reverse();
  }

  return (
    <div tabIndex="0" role="listbox" className={className} {...rest}>
      <ReorderableProvider>
        {clonedItems.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </ReorderableProvider>
    </div>
  );
}

ReorderableList.propTypes = {
  items: PropTypes.array.isRequired,
  onSelection: PropTypes.func.isRequired,
  onReorderItem: PropTypes.func.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  canSelectMultiple: PropTypes.bool,
  isReversed: PropTypes.bool,
  className: PropTypes.string,
};

ReorderableList.defaultProps = {
  canSelectMultiple: false,
  isReversed: false,
  className: '',
};

export default ReorderableList;
