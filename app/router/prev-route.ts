import { createContext } from 'react-router';

export const PrevRouteContext = createContext<string | null>(null);

export const prevRoute = (context: any, value: string) => {
  const check = () => {
    const prevValue = context.get(PrevRouteContext);
    console.log(prevValue, value)
    const isSame = prevValue === value;

    return isSame;
  }

  const update = () => {
    console.log('set!', context)
    context.set(PrevRouteContext, value);
  }

  return {
    check,
    update,
  };
}

