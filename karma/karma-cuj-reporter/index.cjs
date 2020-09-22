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

const CUJReporter = function (baseReporterDecorator, config, logger) {
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

    return `${emoji} **${(percentage * 100).toFixed(2)}%** *(${
      completed.length
    } / ${total.length})*`;
  };

  this.onSpecComplete = function (browser, result) {
    const { skipped, disabled, pending, success, suite } = result;
    const incomplete = skipped || disabled || pending || !success;

    suite.forEach((suiteName) => {
      if (!suiteName?.startsWith('CUJ')) {
        return;
      }

      const [cuj, actions] = suiteName.split(/: ?/).slice(1);
      const actionList = actions.split(/, ?/);
      cujResults.push([cuj, '_TOTAL_', !incomplete]);
      actionList.forEach((action) =>
        cujResults.push([cuj, action, !incomplete])
      );
    });
  };

  this.onRunComplete = function () {
    if (cujResults.length === 0) {
      return;
    }

    cujResults.sort();

    let tableContents = cujResults.reduce((acc, [cuj, action]) => {
      const actionName = action === '_TOTAL_' ? '*[total]*' : action;

      if (
        !acc.find(([_cuj, _action]) => _cuj === cuj && _action === actionName)
      ) {
        acc.push([cuj, actionName, getCompletion(cuj, action)]);
      }

      return acc;
    }, []);

    tableContents = tableContents.map((entry, i) => {
      const [cuj, action, ...rest] = entry;
      if (i !== tableContents.findIndex(([_cuj]) => _cuj === cuj)) {
        return ['', action, ...rest];
      }

      return entry;
    });

    tableContents.unshift(['**CUJ**', '**Action**', '**Completion**']);
    tableContents.push(['*\\[total\\]*', '*\\[total\\]*', getCompletion()]);
    const tableString = table(tableContents);
    log.info('\n' + tableString);

    if (outputFile) {
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, tableString);
    }
  };
};

CUJReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper'];

module.exports = {
  'reporter:cuj': ['type', CUJReporter],
};
