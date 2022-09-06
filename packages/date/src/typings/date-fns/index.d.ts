declare module 'date-fns/locale/_lib/buildLocalizeFn' {
  type LocalizeFunction = (...args: any[]) => any;
  type Width = 'narrow' | 'short' | 'abbreviated' | 'wide';
  type LocalizeValues = Partial<Record<Width, string[]>>;
  type LocalizeFunctionBuilderArg = {
    values: LocalizeValues;
    defaultWidth: Width;
  };
  type LocalizeFunctionBuilder = (
    args: LocalizeFunctionBuilderArg
  ) => LocalizeFunction;
  const localizeFunctionBuilder: LocalizeFunctionBuilder;
  export default localizeFunctionBuilder;
}
