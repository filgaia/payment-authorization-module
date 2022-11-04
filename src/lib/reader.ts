import readline from 'readline'
import { StateType } from './models'

interface ReaderType {
  readonly input: string[]
  readonly start: () => void
  readonly line: (cmd: string) => void
  readonly close: () => void
}

const reader = (
  state: StateType,
  callback: (state: StateType, input: string[]) => StateType
): ReaderType => {
  let rl: readline.Interface
  let input: string[] = []
  const config = {
    input: process.stdin,
    output: process.stdout,
    terminal: false
  }

  const start = (): void => {
    rl = readline.createInterface(config)

    console.log('--- input ---')

    rl.prompt()
    rl.on('line', line)
    rl.once('close', close)
  }

  const line = (cmd: string): void => {
    if (cmd === 'end') {
      rl.close()
    } else {
      input.push(cmd)
    }
  }

  const close = (): void => {
    console.log('--- output ---')
    state = callback(state, input)

    input = []
    start()
  }

  return {
    input,
    start,
    line,
    close
  }
}

export default reader
