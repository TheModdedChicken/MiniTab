/* @refresh reload */
import './index.css';

import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

import Root from './pages/Root';
import Search from './pages/Search';
import { MetaProvider } from '@solidjs/meta';

render(() => (

  <MetaProvider>
    <Router root={Root}>
      <Route path='/' /> {/* Root functionality is handled by Root.tsx */}
      <Route path='/search' component={Search} />
    </Router>
  </MetaProvider>

), document.body!);
