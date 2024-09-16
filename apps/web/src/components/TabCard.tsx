import styles from './TabCard.module.css';

import { Component } from 'solid-js';
import { Tab } from '../utility/types';

interface Props {
  tab: Tab
}

const TabCard: Component<Props> = (props) => {
  return (
    <div class={styles.card}>
      <div>
        <h4 style={{ margin: '4px 0' }}>{props.tab.name}</h4>
        <p style={{ margin: '4px 0' }}>{props.tab.artist}</p>
      </div>
    </div>
  )
}

export default TabCard