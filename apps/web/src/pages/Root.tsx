import styles from './Root.module.css';
import splashes from '../assets/splashes.json';

import { Show, createMemo, useContext, type Component, type ParentProps } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';

import Input, { InputBindings } from '../components/Input';
import Form from '../components/Form';
import { useBindings } from '../utility/bindings';
import { ServiceContext } from '../utility/service';

const Root: Component<ParentProps> = (props) => {
  const navigate = useNavigate();
  const { search } = useContext(ServiceContext);
  const input = useBindings<InputBindings>();

  const isHome = createMemo(() => useLocation().pathname === '/');

  // Focus on search bar when Ctrl+/
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '/') {
      e.preventDefault();
      input.use().focus();
    }
  })

  return (
    <>
      {/* Title Bar */}
      <div class={styles.title}>
        <h1>Mini Tab</h1>
        <sub innerHTML={ // Using innerHTML to allow splash texts to use HTML formatting
          splashes.at(Math.round(Math.random() * (splashes.length - 1)))
        } />
      </div>

      {/* Search Bar */}
      <header class={styles.navbar} not-home={!isHome()}>
        <Form
          class={styles.search}
          onSubmit={(e) => {
            const data = new FormData(e.currentTarget);
            const query = data.get('query')?.toString().trim();

            if (!query) navigate('/');
            else navigate('/search?' + new URLSearchParams({ q: query }).toString());
          }}
        >
          <Input
            bindings={input.bind}
            name='query'
            placeholder='Search by title or artist...'
            value={search.data.query}
          />
        </Form>
      </header>

      {/* Content */}
      <div class={styles.content}>
        <Show when={!isHome()}>
          {props.children}
        </Show>
      </div>

      <footer class={styles.footer}>
        <p>Source ~ <a href='https://github.com/TheModdedChicken/MiniTab'>TheModdedChicken/MiniTab</a></p>
      </footer>
    </>
  );
};

export default Root;
