declare module 'react-stars' {
  import { Component } from 'react';

  interface ReactStarsProps {
    count?: number;
    value?: number;
    onChange?: (newRating: number) => void;
    size?: number;
    color1?: string;
    color2?: string;
    edit?: boolean;
    half?: boolean;
    emptyIcon?: React.ReactElement;
    halfIcon?: React.ReactElement;
    fullIcon?: React.ReactElement;
    a11y?: boolean;
    classNames?: string;
  }

  class ReactStars extends Component<ReactStarsProps> {}

  export default ReactStars;
}
