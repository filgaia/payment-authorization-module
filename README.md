# Payment authorization module in nodejs

Small library that can understand `json` calls one per line and throw an answer after processing the lines

## How to run it

- `npm i`
- `npm run dev`

## Production run

`npm start`

## How to use it

- Multiple lines can be send at once
- The program runs on `console`
- After all json are send you start processing typing `end`

### Rules allowed

- `max-limit`

### Business rules implemented

- `max-limit` not set
- `payment-id` already existed
- `insufficient-limit`

### Input examples

Set max limit. Always set the last one and reset the limit

```json
{"payment-rules": {"max-limit": 100}}
{"payment-rules": {"max-limit": 200}}
```

Payment session already initialized

```json
{"payment-rules": {"max-limit": 100}}
{"payment-session": {"payment-id": 89087653}}
{"payment-session": {"payment-id": 89087653}}
```

Payment rules not initialized

```json
{"payment-session": {"payment-id": 89087653}}
```

Insufficient limit

```json
{"payment-rules": {"max-limit": 100}}
{"payment-session": {"payment-id": 89087654, "cc": "visa", "amount": 120, "time": "2022-02-13T10:00:00.000Z"}}
```

More than three (3) transactions in two minutes

```json
{"payment-rules": {"max-limit": 100}}
{"payment-session": {"payment-id": 89087654, "cc": "visa", "time": "2022-02-13T10:00:00.000Z"}}
{"payment-session": {"payment-id": 89087655, "cc": "visa", "time": "2022-02-13T10:01:00.000Z"}}
{"payment-session": {"payment-id": 89087656, "cc": "visa", "time": "2022-02-13T10:01:00.000Z"}}
```

### Output example

```json
{"payment-session": {"payment-id":89087652,"cc":"visa","amount":30,"time":"2022-02-13T10:00:00.000Z","available-limit":70,"violations":[]}}
```

### Error Handling

- There is no error handling in the app for json parsing. We assume the inputs are correct. Be aware of that
- All errors that have a rule are considered violations and are returned in the output

## References

- [Immer](https://immerjs.github.io/immer/)
- [Eslint](https://typescript-eslint.io/docs/)
- [Prettier](https://prettier.io/)
- [Typescript](https://www.typescriptlang.org/)
- [nodemon](https://github.com/remy/nodemon) For `dev` run
- [Emulating Object-Oriented concepts with Functional Programming](https://github.com/hoppinger/Functional-information-hiding-in-TypeScript)
