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
  useCallback,
  createContext,
  useContext,
} from '@googleforcreators/react';

type EventListener = (event: BeforeUnloadEvent) => void;
interface PreventUnloadContextState {
  listeners: Map<string, EventListener>;
}
const PreventUnloadContext = createContext<PreventUnloadContextState>({
  listeners: new Map(),
});

/**
 * This is a helper that to compliant the correct register/unregister system of `beforeunload` event
 */
const beforeUnloadListener = (event: BeforeUnloadEvent, id: string) => {
  event.preventDefault();
  event.returnValue = id;
};

function usePreventWindowUnload() {
  const context = useContext(PreventUnloadContext);
  const setPreventUnload = useCallback(
    (id: string, value: boolean) => {
      const listener = context.listeners.get(id);
      if (value) {
        // Register beforeunload by scope
        if (!context.listeners.has(id)) {
          context.listeners.set(id, (event: BeforeUnloadEvent) =>
            beforeUnloadListener(event, id)
          );
        }
        if (listener) {
          window.addEventListener('beforeunload', listener);
        }
      } else {
        // Unregister beforeunload by scope
        if (listener) {
          window.removeEventListener('beforeunload', listener);
        }
        context.listeners.delete(id);
      }
    },
    [context]
  );
  return setPreventUnload;
}

declare const WEB_STORIES_DISABLE_PREVENT: string;
const shouldDisablePrevent =
  typeof WEB_STORIES_DISABLE_PREVENT !== 'undefined' &&
  WEB_STORIES_DISABLE_PREVENT === 'true';
// eslint-disable-next-line @typescript-eslint/no-empty-function -- Needed here.
export default shouldDisablePrevent ? () => () => {} : usePreventWindowUnload;
