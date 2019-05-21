# byContract bundled with Webpack

## Set up

```bash
npm i
```

## Dev build

```bash
npm run build:dev
npm start
```

Output:
```
validate( 1, "number|string" ); - fine
validate( null, "number|string" ); - throws expected number|string but got null
```

## Prod build

```bash
npm run build:prod
npm start
```

Output:
```
validate( 1, "number|string" ); - fine
validate( null, "number|string" ); - gets ignored!
```

Note webpack configuration section that switches byContract to Null strategy

```
{
  optimization: {
     minimizer: [
         new TerserPlugin(),
         new webpack.NormalModuleReplacementPlugin(
          /dist\/bycontract\.dev\.js/,
          ".\/bycontract.prod.js"
        )
     ]
  }
}
```


