import produce from 'immer'
import { PaymentSessionType, StateType } from './models'

export interface PaymentsType {
  readonly setMaxLimit: (state: StateType, value: number) => StateType
  readonly rulesToString: (state?: StateType) => string
  readonly pushSession: (
    state: StateType,
    value: PaymentSessionType
  ) => StateType
  readonly sessionToString: (
    value: PaymentSessionType,
    violations: string[]
  ) => string
  readonly validateSession: (
    state: StateType,
    value: PaymentSessionType
  ) => string[]
}

export const defaultState: StateType = {
  'payment-rules': {
    'max-limit': 0
  },
  limit: 0,
  'payment-session': []
}

const payments = (): PaymentsType => {
  const setMaxLimit = (state = defaultState, value: number): StateType => {
    return produce(state, (draft) => {
      draft['payment-rules']['max-limit'] = value
      // To simplify if max limit is set again, we reset the limit. We could calculate the new limit
      // Checking if the new 'max-limit' > limit add (limit - 'max-limit')
      // If smaller check if value < limit then set limit = value
      draft.limit = value
    })
  }

  const rulesToString = (state = defaultState): string =>
    `{"payment-rules": ${JSON.stringify(state['payment-rules'])}}`

  const sessionToString = (
    value: PaymentSessionType,
    violations: string[]
  ): string => {
    const session = {
      ...value,
      violations
    }
    return `{"payment-session": ${JSON.stringify(session)}}`
  }

  const validateSession = (
    state = defaultState,
    value: PaymentSessionType
  ): string[] => {
    const violations: string[] = []

    if (state['payment-rules']['max-limit'] === 0) {
      violations.push(
        'payment-rules-not-initialized',
        'payment-session-not-initialized'
      )
    }

    const existed = state['payment-session'].find(
      (session) => session['payment-id'] === value['payment-id']
    )

    if (existed !== undefined) {
      violations.push('payment-session-already-initialized')
    }

    if (state.limit < (value?.amount ?? 0)) {
      violations.push('insufficient-limit')
    }

    if (value.time !== undefined) {
      let difference = 0
      let count = 0

      for (const session of state['payment-session']) {
        const start = new Date(value.time)
        const end = new Date(session.time)
        difference = Math.abs(start.getTime() - end.getTime())

        // if transaction happens in less than two minutes
        if (difference < 60 * 2 * 1000) {
          count++
        }

        // If there is are 3 transactions in les than two minutes (2 in session plus current)
        if (count > 1) {
          violations.push('high-frequency-small-interval')
          break
        }
      }
    }

    return violations
  }

  const pushSession = (
    state = defaultState,
    value: PaymentSessionType
  ): StateType => {
    return produce(state, (draft) => {
      draft.limit -= value?.amount ?? 0
      draft['payment-session'].push({
        ...value,
        'available-limit': draft.limit,
        violations: []
      })
    })
  }

  return {
    setMaxLimit,
    rulesToString,
    sessionToString,
    pushSession,
    validateSession
  }
}

export default payments
