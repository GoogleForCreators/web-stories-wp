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

const DndMode = {
  OFF: 0,
  MAYBE: 1,
  ON: 2,
};

/**
 * Supports the Puppeteer Mouse interface with DND simulation.
 * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-mouse
 */
class MouseWithDnd {
  /**
   * @param {Object} page Page.
   * @param {Object} frame Frame.
   */
  constructor(page, frame) {
    this._page = page;
    this._mouse = page.mouse;
    this._xy = [-1, -1];
    this._dndMode = DndMode.OFF;
    this._client = new DndClientBinding(frame);
  }

  async click(x, y, options = {}) {
    this._cancelDnd();
    await this._mouse.click(x, y, options);
  }

  async down(options = {}) {
    this._cancelDnd();
    const [x, y] = this._xy;
    const canStartDnd = await this._client.canStart(x, y);
    if (canStartDnd) {
      this._dndMode = DndMode.MAYBE;
    }
    return this._mouse.down(options);
  }

  async move(x, y, options = {}) {
    const [startX, startY] = this._xy;
    this._xy = [x, y];
    if (this._dndMode === DndMode.MAYBE) {
      const startResult = await this._client.start(startX, startY);
      this._dndMode = startResult ? DndMode.ON : DndMode.OFF;
    }
    if (this._dndMode === DndMode.ON) {
      const steps = options.steps || 1;
      const dx = (x - startX) / steps;
      const dy = (y - startY) / steps;
      for (let i = 1; i <= steps; i++) {
        const ix = i === steps ? x : startX + i * dx;
        const iy = i === steps ? y : startY + i * dy;
        // eslint-disable-next-line no-await-in-loop
        await this._client.drag(ix, iy);
      }
    } else {
      await this._mouse.move(x, y, options);
    }
  }

  async up(options = {}) {
    if (this._dndMode === DndMode.ON) {
      this._dndMode = DndMode.OFF;
      const [endX, endY] = this._xy;
      await this._client.end(endX, endY);
    } else {
      this._dndMode = DndMode.OFF;
      await this._mouse.up(options);
    }
  }

  async _cancelDnd() {
    if (this._dndMode !== DndMode.OFF) {
      if (this._dndMode === DndMode.ON) {
        const [endX, endY] = this._xy;
        await this._client.end(endX, endY, /* canceled */ true);
      }
      this._dndMode = DndMode.OFF;
    }
  }

  async wheel(options = {}) {
    await this._mouse.wheel(options);
  }
}

/**
 * The binding to the client running in the page.
 */
class DndClientBinding {
  /**
   * @param {Object} context Context.
   */
  constructor(context) {
    this._context = context;

    // Start client intialization right away.
    this._whenClientReady();
  }

  /**
   * @return {Promise} Resolves when client is ready.
   */
  _whenClientReady() {
    return this._context.evaluate(() => {
      if (window.__karma_dnd) {
        // Already handled.
        return;
      }

      class DndClient {
        constructor() {
          this._draggable = null;
          this._dataTransfer = null;
          this._target = null;
          this._dropping = false;

          document.addEventListener(
            'dragstart',
            function (e) {
              if (e.isTrusted) {
                e.preventDefault();
                e.stopPropagation();
                if (e.stopImmediatePropagation) {
                  e.stopImmediatePropagation();
                }
              }
            },
            true
          );
        }

        /**
         * @param {number} clientX X coordinates.
         * @param {number} clientY Y coordinates.
         * @return {boolean} Returns `true` if DND can be started at these
         * coordinates.
         */
        canStart(clientX, clientY) {
          this._draggable = this._getDraggable(clientX, clientY);
          return Boolean(this._draggable);
        }

        /**
         * @param {number} clientX X coordinates.
         * @param {number} clientY Y coordinates.
         * @return {boolean} Returns `true` if DND has successfully started.
         */
        start(clientX, clientY) {
          const dataTransfer = (this._dataTransfer = new DataTransfer());
          return this._dispatchEvent(this._draggable, 'dragstart', {
            cancelable: true,
            clientX,
            clientY,
            dataTransfer,
          });
        }

        /**
         * @param {number} clientX X coordinates.
         * @param {number} clientY Y coordinates.
         * @param {boolean} canceled Whether the event is canceled.
         */
        end(clientX, clientY, canceled) {
          const dataTransfer = this._dataTransfer;
          const dropping = this._dropping;
          const target = this._target;
          const draggable = this._draggable;

          this._draggable = null;
          this._dataTransfer = null;
          this._target = null;
          this._dropping = false;

          if (dropping && !canceled) {
            this._dispatchEvent(target, 'drop', {
              cancelable: false,
              clientX,
              clientY,
              dataTransfer,
            });
          } else {
            this._dispatchEvent(target, 'dragleave', {
              cancelable: false,
              clientX,
              clientY,
              dataTransfer,
            });
          }
          this._dispatchEvent(draggable, 'dragend', {
            cancelable: false,
            clientX,
            clientY,
            dataTransfer,
          });
        }

        /**
         * @param {number} clientX X coordinates.
         * @param {number} clientY Y coordinates.
         */
        drag(clientX, clientY) {
          const dataTransfer = this._dataTransfer;
          const oldTarget = this._target;
          const target = document.elementFromPoint(clientX, clientY);
          if (target !== oldTarget) {
            // Change the drop targets.
            this._target = target;
            // It's very important that the "dragenter" is sent before
            // "dragleave".
            if (target) {
              this._dropping = !this._dispatchEvent(target, 'dragenter', {
                cancelable: true,
                clientX,
                clientY,
                dataTransfer,
              });
            }
            if (oldTarget) {
              this._dispatchEvent(oldTarget, 'dragleave', {
                cancelable: false,
                clientX,
                clientY,
                dataTransfer,
              });
            }
          }
          this._dropping = !this._dispatchEvent(this._target, 'dragover', {
            cancelable: true,
            clientX,
            clientY,
            dataTransfer,
          });
          this._dispatchEvent(this._draggable, 'drag', {
            cancelable: true,
            clientX,
            clientY,
            dataTransfer,
          });
        }

        _getDraggable(clientX, clientY) {
          const topElement = document.elementFromPoint(clientX, clientY);
          if (topElement) {
            for (let n = topElement; n; n = n.parentElement) {
              const element = n;
              const draggableAttr = element.getAttribute('draggable');
              if (draggableAttr === 'false') {
                continue;
              }
              if (element.tagName === 'IMG' || draggableAttr === 'true') {
                return element;
              }
            }
          }
          return null;
        }

        _dispatchEvent(target, type, options) {
          const event = new DragEvent(type, {
            bubbles: true,
            ...options,
          });
          return target.dispatchEvent(event);
        }
      }
      window.__karma_dnd = new DndClient();
    });
  }

  /**
   * @param {number} clientX X coordinates.
   * @param {number} clientY Y coordinates.
   * @return {Promise<boolean>} Returns `true` if DND can be started at these
   * coordinates.
   */
  async canStart(clientX, clientY) {
    await this._whenClientReady();
    return this._context.evaluate(
      (ax, ay) => window.__karma_dnd.canStart(ax, ay),
      clientX,
      clientY
    );
  }

  /**
   * @param {number} clientX X coordinates.
   * @param {number} clientY Y coordinates.
   * @return {Promise<boolean>} Returns `true` if DND has successfully started.
   */
  async start(clientX, clientY) {
    await this._whenClientReady();
    return this._context.evaluate(
      (ax, ay) => window.__karma_dnd.start(ax, ay),
      clientX,
      clientY
    );
  }

  /**
   * @param {number} clientX X coordinates.
   * @param {number} clientY Y coordinates.
   * @return {Promise} Resolves when the event has been processed.
   */
  async drag(clientX, clientY) {
    await this._whenClientReady();
    return this._context.evaluate(
      (ax, ay) => window.__karma_dnd.drag(ax, ay),
      clientX,
      clientY
    );
  }

  /**
   * Completes the DND sequence.
   *
   * @param {number} clientX X coordinates.
   * @param {number} clientY Y coordinates.
   * @param {boolean} canceled Whether the event is canceled.
   * @return {Promise} Resolves when the event has been processed.
   */
  async end(clientX, clientY, canceled = false) {
    await this._whenClientReady();
    return this._context.evaluate(
      (x, y, canceld) => window.__karma_dnd.end(x, y, canceld),
      clientX,
      clientY,
      canceled
    );
  }
}

module.exports = MouseWithDnd;
