import styles from './Search.module.css';

import * as API from 'server';
import { Component, For, createEffect, createResource, onMount, useContext } from 'solid-js';
import { action, useAction, useSearchParams } from '@solidjs/router';
import TabCard from '../components/TabCard';
import { ServiceContext } from '../utility/service';
import api from '../utility/api';

const getTabsAction = action(async (args: API.Types.SearchArgs) => {
  const res = await api.tabs.$post({ json: args });

  if (res.ok) return await res.json();

  return null;
});

const Search: Component = () => {
  const [{ q }, setSearchParams] = useSearchParams();
  const { search } = useContext(ServiceContext);

  onMount(() => (q && search.setData('query', q)));

  const [data, { mutate, refetch }] = createResource(() => ({
    value: q
  }), useAction(getTabsAction));

  return (
    <>
      <div class={styles.tabs}>
        <For each={data.latest?.results || []}>
          {(t) => <TabCard tab={t} />}
        </For>
      </div>
    </>
  )
}

export default Search