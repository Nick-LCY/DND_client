import { Effect, Expression } from "../originalDataType"
interface SourcedEffectType {
    sources: string[]
    effect: Effect
}

interface SourcedExpressionType {
    sources: string[]
    expression: Expression
}

export type { SourcedEffectType, SourcedExpressionType }