/**
 * @copyright 2021 Sasha Koss and Lesha Koss https://kossnocorp.mit-license.org
 * @license   MIT
 */

/**
 * Original code from date-fns package modified for this project.
 *
 * @see https://github.com/date-fns/date-fns/issues/1116
 * @see https://github.com/date-fns/date-fns/blob/fadbd4eb7920bf932c25f734f3949027b2fe4887/src/locale/_lib/buildLocalizeFn/index.ts
 * @copyright 2023 Google LLC
 * @license   Apache-2.0
 */

type Era = 0 | 1;

type Quarter = 1 | 2 | 3 | 4;

type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type Unit =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'dayOfYear'
  | 'date'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

type LocalePatternWidth = 'narrow' | 'short' | 'abbreviated' | 'wide' | 'any';

type LocaleDayPeriod =
  | 'am'
  | 'pm'
  | 'midnight'
  | 'noon'
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night';

type LocaleUnit = Era | Quarter | Month | Day | LocaleDayPeriod;

type LocalizeUnitIndex<U extends LocaleUnit | number> = U extends LocaleUnit
  ? LocalizeUnitValuesIndex<LocalizeUnitValues<U>>
  : number;

type LocalizeFn<
  Result extends LocaleUnit | number,
  ArgCallback extends
    | BuildLocalizeFnArgCallback<Result>
    | undefined = undefined,
> = (
  value: ArgCallback extends undefined
    ? Result
    : Result extends Quarter
    ? Quarter
    : LocalizeUnitIndex<Result>,
  options?: {
    width?: LocalePatternWidth;
    context?: 'formatting' | 'standalone';
    unit?: Unit;
  }
) => string;

type LocalizeEraValues = readonly [string, string];

type LocalizeQuarterValues = readonly [string, string, string, string];

type LocalizeDayValues = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

type LocalizeMonthValues = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

type LocalizeUnitValuesIndex<Values extends LocalizeUnitValues<any>> =
  Values extends Record<LocaleDayPeriod, string>
    ? string
    : Values extends LocalizeEraValues
    ? Era
    : Values extends LocalizeQuarterValues
    ? Quarter
    : Values extends LocalizeDayValues
    ? Day
    : Values extends LocalizeMonthValues
    ? Month
    : never;

type LocalizeUnitValues<U extends LocaleUnit> = U extends LocaleDayPeriod
  ? Record<LocaleDayPeriod, string>
  : U extends Era
  ? LocalizeEraValues
  : U extends Quarter
  ? LocalizeQuarterValues
  : U extends Day
  ? LocalizeDayValues
  : U extends Month
  ? LocalizeMonthValues
  : never;

type LocalizePeriodValuesMap<U extends LocaleUnit> = {
  [pattern in LocalePatternWidth]?: LocalizeUnitValues<U>;
};

type BuildLocalizeFnArgCallback<Result extends LocaleUnit | number> = (
  value: Result
) => LocalizeUnitIndex<Result>;

type BuildLocalizeFnArgs<
  Result extends LocaleUnit,
  ArgCallback extends BuildLocalizeFnArgCallback<Result> | undefined,
> = {
  values: LocalizePeriodValuesMap<Result>;
  defaultWidth: LocalePatternWidth;
  formattingValues?: LocalizePeriodValuesMap<Result>;
  defaultFormattingWidth?: LocalePatternWidth;
} & (ArgCallback extends undefined
  ? { argumentCallback?: undefined }
  : { argumentCallback: BuildLocalizeFnArgCallback<Result> });

export default function buildLocalizeFn<
  Result extends LocaleUnit,
  ArgCallback extends BuildLocalizeFnArgCallback<Result> | undefined,
>(
  args: BuildLocalizeFnArgs<Result, ArgCallback>
): LocalizeFn<Result, ArgCallback> {
  return (dirtyIndex, options) => {
    const context = options?.context ? String(options.context) : 'standalone';

    let valuesArray: LocalizeUnitValues<Result>;
    if (context === 'formatting' && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = (
        options?.width ? String(options.width) : defaultWidth
      ) as LocalePatternWidth;
      valuesArray = (args.formattingValues[width] ||
        args.formattingValues[defaultWidth]) as LocalizeUnitValues<Result>;
    } else {
      const defaultWidth = args.defaultWidth;
      const width = (
        options?.width ? String(options.width) : args.defaultWidth
      ) as LocalePatternWidth;
      valuesArray = (args.values[width] ||
        args.values[defaultWidth]) as LocalizeUnitValues<Result>;
    }
    const index = (
      args.argumentCallback
        ? args.argumentCallback(dirtyIndex as Result)
        : (dirtyIndex as LocalizeUnitIndex<Result> as unknown)
    ) as LocalizeUnitValuesIndex<typeof valuesArray>;
    // @ts-ignore: For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
    return valuesArray[index];
  };
}
