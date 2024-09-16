import { ContextProviderComponent, createContext } from 'solid-js';
import Search from '../services/search';

export const ServiceContext = createContext({
  search: Search()
});

export const ServiceProvider: ContextProviderComponent<typeof ServiceContext['defaultValue']> = (props) => {
  return (
    <ServiceContext.Provider value={props.value}>
      {props.children}
    </ServiceContext.Provider>
  )
}