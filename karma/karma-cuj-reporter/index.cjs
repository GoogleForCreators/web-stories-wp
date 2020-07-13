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
const path = require('path');
const fs = require('fs');
const table = require('markdown-table');

const CUJReporter = function (baseReporterDecorator, config, logger, helper) {
  baseReporterDecorator(this);

  const log = logger.create('reporter.cuj');

  const { cujReporter: cujReporterConfig = {} } = config;
  const { outputFile } = cujReporterConfig;

  // CUJ, Action, File, Success;
  const cujResults = [];

  const getCompletion = (cuj, action) => {
    const total = cujResults.filter(
      ([_cuj, _action]) =>
        (cuj ? _cuj === cuj : true) && (action ? _action === action : true)
    );
    const completed = total.filter(([, , completed]) => completed);

    const percentage = Number(completed.length / total.length);
    let emoji = '🚨';

    if (percentage === 1) {
      emoji = '🏆';
    } else if (percentage >= 0.9) {
      emoji = '🏔️';
    } else if (percentage >= 0.5) {
      emoji = '🛴';
    }

    return `${emoji} **${(percentage * 100).toFixed(2)}%**`;
  };

  this.onSpecComplete = function (browser, result) {
    const { skipped, disabled, pending, success, suite } = result;
    const incomplete = skipped || disabled || pending || !success;

    if (!suite[0].startsWith('CUJ') || !suite[1].startsWith('Action')) {
      return;
    }

    const cuj = suite[0].slice(5);
    const action = suite[1].slice(8);

    cujResults.push([cuj, action, !incomplete]);
  };

  this.onRunComplete = function () {
    if (cujResults.length === 0) {
      return;
    }

    const tableContents = cujResults.reduce((acc, curr) => {
      const [cuj, action] = curr;

      if (!acc.find(([_cuj]) => _cuj === cuj)) {
        acc.push([cuj, '*\\[total\\]*', getCompletion(cuj)]);
      }

      if (!acc.find(([_cuj, _action]) => _cuj === cuj && _action === action)) {
        acc.push(['', action, getCompletion(cuj, action)]);
      }

      return acc;
    }, []);

    tableContents.unshift(['**CUJ**', '**Action**', '**Completion**']);
    tableContents.push(['*\\[total\\]*', '*\\[total\\]*', getCompletion()]);
    const tableString = table(tableContents);
    log.info('\n' + tableString);

    if (outputFile) {
      helper.mkdirIfNotExists(path.dirname(outputFile), function () {
        fs.writeFileSync(outputFile, tableString);
      });
    }
  };
};

CUJReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper'];

module.exports = {
  'reporter:cuj': ['type', CUJReporter],
};
