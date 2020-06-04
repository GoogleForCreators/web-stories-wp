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
 * Internal dependencies
 */
import { useHistory } from '../../app/history';
import { useStory } from '../../app/story';

function ErrorActions({ reRender }) {
  // Disable auto-save?
  const {
    state: { canUndo },
    actions: { undo },
  } = useHistory();
  const {
    actions: { saveStory },
  } = useStory();

  const tryRecover = () => {
    if (canUndo) {
      undo();
    }
    setTimeout(reRender, 0);
  };

  const reload = () => {
    // saveStory(); // save & reload doesn't make much sense?
    setTimeout(() => (window.location = window.location), 0);
  };

  return (
    <div>
      <h3 className="loading-message" style={{ padding: 40 }}>
        Editor has crashed.
        <br />
        {canUndo ? (
          <>
            Try to recover with{' '}
            <button onClick={tryRecover}>undo & re-render</button>.
          </>
        ) : (
          <>
            Try <button onClick={reload}>reload</button> if that doesn't help,
            wait for a fix.
          </>
        )}
      </h3>
    </div>
  );
}

export default ErrorActions;
