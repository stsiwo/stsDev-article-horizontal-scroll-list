# Horizontal List With Swipe 

## Main Dependencies

  * [ReactJS](https://reactjs.org/)
  * [CRA](https://github.com/facebook/create-react-app)
  * [TypeScript](https://www.typescriptlang.org/)
  * [styled components](https://styled-components.com/)

## How To Run 

  1. clone this repository to your local
  2. install its dependencies
  3. start dev server 
  
## Q&A

  ### My tsconfig.json is overwritten every time run 'npm start' and TypeScript complains that 'Cannot use JSX unless the '--jsx' flag is provided'. How do I fixed that?

 This is because you are using old TypeScript (3.x.x),so bump up to (4.x.x).
 
 ref: https://stackoverflow.com/questions/50432556/cannot-use-jsx-unless-the-jsx-flag-is-provided

  
  ### The ending padding is ignored when flex & horizontal scroll. How do I add the ending padding?

  It turned out that it is NOT a bug. the browsers ignore the ending padding. the solution is to add 'after' pseudo attribute of container element.
  ```
    .container::after {
      content: '';
      padding-right: 0.02px; /* smallest size that is cross browser */
    }
  ```

   ref: [how to fix the missing ending padding](https://webplatform.news/issues/2019-08-07)
  
  ### Do I have to use flexbox to implement this swiping feature?
  
  No! You can implement it using grid too. It is my personal preference. Also, flexbox supports more browsers than grid. (flexbox: 99.18% supported and grid: 95.86% supported at 15/12/2020) 
    
  refs: [browser support for flex](https://caniuse.com/?search=flex), [browser support for grid](https://caniuse.com/?search=grid)
  
  ### Swiping is not smooth on mobile. How do I fix that?
  
  You need to install the polyfill to make swiping smooth. install the following dependencies.
  
  * [smoothscroll-polyfill](https://www.npmjs.com/package/smoothscroll-polyfill)
  * [@types/smoothscroll-polyfill](https://www.npmjs.com/package/@types/smoothscroll-polyfill) (if you use TS)
