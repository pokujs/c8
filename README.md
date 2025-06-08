## @pokujs/c8

☔️ Facilitator utility for coverage with [**c8**](https://github.com/bcoe/c8) using [**Poku**](https://github.com/wellwelwel/poku).

> [!IMPORTANT]
>
> WIP 🚧
>
> - https://github.com/wellwelwel/poku/pull/996

### Installation

```sh
npm i -D poku @pokujs/c8
```

### Usage

#### — NPX

```sh
npx poku --coverage=c8
```

#### — package.json

```json
{
  "scripts": {
    "test": "poku --coverage=c8"
  }
}
```

```sh
npm test
```
