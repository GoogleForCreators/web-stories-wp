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
import { useCallback, useEffect, useState } from '@googleforcreators/react';

type ClickCallback = (evt: MouseEvent, target: Element) => void;

/**
 * This hook creates a handler to use for double click listening
 * on a node, where single clicks are also relevant. Default timeout
 * is 200 ms. If no subsequent click has been recorded in the given
 * time, single click will be assumed.
 *
 * This hook returns a handler retrieval function, not the handler
 * itself. This allows the component to use the same hook for multiple
 * children listening for events.
 *
 * For example:
 * ```
 * function SomeComponent() {
 *   const handleSingle = useCallback( ( evt, item ) => {
 *     // Handle single click on `item`
 *   }, [] );
 *   const handleDouble = useCallback( ( evt, item ) => {
 *     // Handle double click on `item`
 *   }, [] );
 *   const getHandler = useDoubleClick( handleSingle, handleDouble );
 *   const items = [
 *     // Some objects with `id` and `name` attributes.
 *   ];
 *   return items.map( ( item} ) => (
 *     <button key={ item.id } onClick={ getHandler( item ) }>
 *       { item.name }
 *     </button>
 *   ) );
 * }
 * ```
 *
 * @param onSingleClick  Handler to activate on single click.
 * @param onDoubleClick  Handler to activate on double click.
 * @param ms             Timeout in ms to wait - defaults to 200.
 * @return Handler retrieval function to get an onClick listener (invoke with unique value).
 */
const useDoubleClick = (
  onSingleClick: ClickCallback,
  onDoubleClick: ClickCallback,
  ms = 200
) => {
  const [target, setTarget] = useState<Element | null>(null);
  const [lastEvent, setLastEvent] = useState<MouseEvent | null>(null);
  const getHandler = useCallback(
    (newTarget: Element) => (evt: MouseEvent) => {
      evt.stopPropagation();

      if (target !== newTarget) {
        if (target) {
          onSingleClick(evt, target);
        }
        setTarget(newTarget);
        setLastEvent(evt);
        return;
      }

      onDoubleClick(evt, target);
      setTarget(null);
    },
    [onSingleClick, onDoubleClick, target]
  );
  useEffect(() => {
    if (!target) {
      return undefined;
    }
    const int = setTimeout(() => {
      setTarget(null);
      if (lastEvent && target) {
        onSingleClick(lastEvent, target);
      }
    }, ms);
    return () => {
      clearTimeout(int);
    };
  }, [target, lastEvent, onSingleClick, ms]);

  return getHandler;
};

export default useDoubleClick;
