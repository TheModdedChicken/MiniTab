import { Component, JSX, ParentProps } from 'solid-js';

interface Props extends ParentProps {
  class?: string
  onSubmit?: JSX.HTMLAttributes<HTMLFormElement>['onSubmit']
}

const Form: Component<Props> = (props) => {
  return (
    <form
      class={props.class}

      // I find it hilarious that this is allowed
      onsubmit={(e) => e.preventDefault()}
      onSubmit={props.onSubmit}
    >
      {props.children}
    </form>
  )
}

export default Form