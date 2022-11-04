export interface PaymentRuleType {
  readonly ['max-limit']: number
}

export interface PaymentSessionType {
  readonly ['payment-id']: number
  readonly cc: string // could be too 'visa' | 'mastercard' | amex ...
  readonly amount?: number
  readonly ['available-limit']: number
  readonly violations: string[] // could ve a violationType enum with 'insufficient-limit' ...
  readonly time: Date
}

export interface StateType {
  readonly ['payment-rules']: PaymentRuleType
  readonly ['payment-session']: PaymentSessionType[]
  readonly limit: number
}

export interface DataType {
  readonly ['payment-rules']: PaymentRuleType
  readonly ['payment-session']: PaymentSessionType
}
