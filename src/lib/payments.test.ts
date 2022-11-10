import { PaymentSessionType, StateType } from './models'
import payments, { defaultState } from './payments'

describe('Test lib payments', () => {
  let state: StateType
  const myPayments = payments()

  beforeEach(() => {
    state = defaultState
  })

  it('Should set the max limit', () => {
    const maxValue = 100

    state = myPayments.setMaxLimit(state, maxValue)

    expect(state['payment-rules']['max-limit']).toEqual(maxValue)
  })

  it('Should print rules as a string', () => {
    const result = myPayments.rulesToString()

    expect(result).toEqual('{"payment-rules": {"max-limit":0}}')
  })

  it('Should add a new session', () => {
    state = myPayments.pushSession(state, {
      'payment-id': 1,
      cc: 'visa',
      violations: [],
      time: Date.now().toString()
    })

    expect(state['payment-session'].length).toEqual(1)
  })

  it('Should validate payment-rules-not-initialized', () => {
    const value: PaymentSessionType = {
      'payment-id': 1,
      cc: 'visa',
      violations: [],
      time: Date.now().toString()
    }
    const violations = myPayments.validateSession(state, value)

    expect(violations?.[0]).toEqual('payment-rules-not-initialized')
  })

  it('Should validate payment-rules-not-initialized', () => {
    const value: PaymentSessionType = {
      'payment-id': 1,
      cc: 'visa',
      violations: [],
      time: Date.now().toString()
    }

    state = myPayments.setMaxLimit(state, 100)
    state = myPayments.pushSession(state, value)
    const violations = myPayments.validateSession(state, value)

    expect(violations?.[0]).toEqual('payment-session-already-initialized')
  })

  it('Should validate insufficient-limit', () => {
    const value: PaymentSessionType = {
      'payment-id': 1,
      cc: 'visa',
      violations: [],
      time: Date.now().toString(),
      amount: 120
    }

    state = myPayments.setMaxLimit(state, 100)
    const violations = myPayments.validateSession(state, value)

    expect(violations?.[0]).toEqual('insufficient-limit')
  })

  it('Should validate high-frequency-small-interval', () => {
    const value = {
      'payment-id': 1,
      cc: 'visa',
      violations: [],
      time: new Date().toISOString()
    }
    const end = new Date(value.time)

    state = myPayments.setMaxLimit(state, 100)
    state = myPayments.pushSession(state, value as PaymentSessionType)

    value['payment-id'] = 2
    state = myPayments.pushSession(state, value as PaymentSessionType)

    value['payment-id'] = 3
    end.setMinutes(end.getMinutes() + 1)
    value.time = end.toISOString()

    const violations = myPayments.validateSession(
      state,
      value as PaymentSessionType
    )

    expect(violations?.[0]).toEqual('high-frequency-small-interval')
  })
})
