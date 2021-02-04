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
import {
  Modifier,
  convertFromHTML,
  ContentState,
  SelectionState,
} from 'draft-js';

/**
 * Internal dependencies
 */
import convertStyles from './formatters/convert';

class CustomBlockRenderMap {
  constructor() {
    // Generally only allow unstyled block types
    // However, we want to add list styles so keep those
    // Will be replaced with unstyled blocks later
    this._map = {
      unstyled: {
        element: 'div',
        aliasedElements: ['p', 'h1', 'h2', 'h3', 'blockquote', 'pre'],
      },
      'unordered-list-item': {
        element: 'li',
      },
      'ordered-list-item': {
        element: 'li',
      },
    };
  }

  // The only function from immutable.js#Map, that we need to implement
  mapKeys(callback) {
    return Object.keys(this._map).map((key) => callback(key, this._map[key]));
  }
}

function getPastedBlocks(html, existingStyles = []) {
  const renderMap = new CustomBlockRenderMap();
  const { contentBlocks, entityMap } = convertFromHTML(
    html,
    undefined /* This has to be undefined to trigger default argument */,
    renderMap
  );
  const pastedContentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  );

  // Now select everything and remove entity from it all
  const entireSelection = selectEverything(pastedContentState);
  const noEntityContent = Modifier.applyEntity(
    pastedContentState,
    entireSelection,
    null
  );

  // Then walk through entire content, building a new parallel document in `updatedContentState`
  // with corrected styles and the required added list styles
  const newContentBlocks = noEntityContent.getBlocksAsArray();
  let updatedContentState = noEntityContent;
  let lastBlockType = null;
  let lastBlockNumber = 0;

  newContentBlocks.forEach((contentBlock) => {
    const blockSelection = SelectionState.createEmpty(contentBlock.getKey());
    updatedContentState = convertStyles(
      contentBlock,
      blockSelection,
      updatedContentState
    );

    // Then, if it is some list item block, prefix with proper symbol and change type to unstyled
    const blockType = contentBlock.getType();
    if (blockType !== 'unstyled') {
      let replacementText = null;
      switch (blockType) {
        case 'unordered-list-item':
          replacementText = '– ';
          break;
        case 'ordered-list-item':
          lastBlockNumber =
            lastBlockType === blockType ? lastBlockNumber + 1 : 1;
          replacementText = `${lastBlockNumber}. `;
          break;
        default:
          break;
      }
      if (replacementText) {
        // Insert text at start of block
        updatedContentState = Modifier.insertText(
          updatedContentState,
          blockSelection,
          replacementText
        );
      }
      // Reset block type for entire block
      const entireBlockSelection = blockSelection.merge({
        focusOffset: contentBlock.getLength(),
      });
      updatedContentState = Modifier.setBlockType(
        updatedContentState,
        entireBlockSelection,
        'unstyled'
      );
    }
    lastBlockType = blockType;
  });

  // Finally, apply existing styles if any
  const everythingSelection = selectEverything(updatedContentState);
  existingStyles.forEach((existingStyle) => {
    updatedContentState = Modifier.applyInlineStyle(
      updatedContentState,
      everythingSelection,
      existingStyle
    );
  });

  return updatedContentState.getBlockMap();
}

export default getPastedBlocks;

function selectEverything(contentState) {
  const firstBlock = contentState.getFirstBlock();
  const lastBlock = contentState.getLastBlock();
  return SelectionState.createEmpty(firstBlock.getKey()).merge({
    focusKey: lastBlock.getKey(),
    focusOffset: lastBlock.getLength(),
  });
}
