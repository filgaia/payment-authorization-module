import reader from './lib/reader'
import parser from './lib/parser'
import { StateType } from './lib/models'
import { defaultState } from './lib/payments'

// implement immutable
// implement types
// implement business rules
// write readme
const main = (): void => {
  const state: StateType = defaultState
  const myReader = reader(state, parser)

  myReader.start()
}

main()
