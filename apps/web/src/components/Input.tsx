import { BindingProps, createBindings } from '../utility/bindings';
import styles from './Input.module.css';

import { Component, JSX } from 'solid-js';

export interface InputBindings {
  focus: () => void
  blur: () => void
}

interface Props extends BindingProps<InputBindings> {
  name?: string
  class?: string
  style?: JSX.HTMLAttributes<HTMLInputElement>['style']

  value?: JSX.InputHTMLAttributes<HTMLInputElement>['value']
  placeholder?: string
  suggestions?: string[]

  onFocus?: JSX.HTMLAttributes<HTMLInputElement>['onFocus']
  onChange?: JSX.HTMLAttributes<HTMLInputElement>['onChange']
  onSubmit?: JSX.HTMLAttributes<HTMLInputElement>['onSubmit']
}

const Input: Component<Props> = (props) => {
  let input!: HTMLInputElement;

  createBindings(props.bindings, {
    focus: () => input.focus(),
    blur: () => input.blur()
  })

  return (
    <div class={`${styles.container} ${props.class || ''}`}>
      <input
        ref={input}
        name={props.name}
        class={styles.input}
        style={props.style}

        autocomplete='off'

        placeholder={props.placeholder}
        value={props.value}
        onFocus={props.onFocus}
        onChange={props.onChange}
        onSubmit={props.onSubmit}

        onKeyDown={(e) => {
          if (e.key === 'Escape') e.currentTarget.blur()
        }}
      />
    </div>
  )
}

export default Input