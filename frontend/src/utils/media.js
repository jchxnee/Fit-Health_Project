import { css } from 'styled-components';

const breakpoints = {
  xs: 320,
  sm: 576,
  md: 768,
  lg: 1008,
};

const media = Object.keys(breakpoints).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${breakpoints[label]}px) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});

export default media;
