import { DataType, StateType } from './models'
import payments from './payments'

const parser = (state: StateType, input: string[]): StateType => {
  const myPayments = payments()
  input.forEach((value: string): void => {
    const data: DataType = JSON.parse(value)

    if (data['payment-rules'] !== undefined) {
      state = myPayments.setMaxLimit(
        state,
        data['payment-rules']?.['max-limit']
      )
      console.log(myPayments.rulesToString(state))
    }

    if (data['payment-session'] !== undefined) {
      const violations = myPayments.validateSession(
        state,
        data['payment-session']
      )

      if (violations.length === 0) {
        state = myPayments.pushSession(state, data['payment-session'])
      }

      console.log(
        myPayments.sessionToString(
          { ...data['payment-session'], 'available-limit': state.limit },
          violations
        )
      )
    }
  })

  return state
}

export default parser
