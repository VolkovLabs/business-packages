# Jest selectors

## Install

```
npm install --save-dev @volkovlabs/jest-selectors
```

## Example of usage

```javascript
import { screen } from '@testing-library/react'
import { getJestSelectors } from '@volkovlabs/jest-selectors';

const TestIds = {
  panel: {
    container: 'data-testid panel',
    button: (name: string) => 'panel button ${name}',
  }
}

const getPanelSelectors = getJestSelectors(TestIds.panel);

test('Panel', () => {
  const selectors = getPanelSelectors(screen)

  selectors.container() // screen.getByTestId
  selectors.container(true) // screen.queryByTestId
  selectors.button(false, 'submit') // screen.getByLabelText
  selectors.button(true, 'submit') // screen.queryByLabelText
})
```

## License

Apache License Version 2.0.
