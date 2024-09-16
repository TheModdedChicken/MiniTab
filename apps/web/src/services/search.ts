import { createStore } from 'solid-js/store';

const store = createStore({
  query: ""
});

const Search = () => {
  const [data, setData] = store;

  return {
    data,
    setData
  }
}

export default Search