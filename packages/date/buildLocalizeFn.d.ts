declare module 'date-fns/locale/_lib/buildLocalizeFn' {
  type LocalizeFunction = (...args: any[]) => any;
  type LocalizeFunctionBuilder = (args: any) => LocalizeFunction;
  const localizeFunctionBuilder: LocalizeFunctionBuilder;
  export default localizeFunctionBuilder;
}
