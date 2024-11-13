import type { Expression } from "../originalDataType"
import { isExpression, isValue } from "../originalDataType"
import { findBeforeTarget } from "./utils"
import { characterResult } from "./expressionResults"

function findRootObject(target: string): any {
    let root = target.split(".")[0]
    switch (root) {
        case "character":
            return characterResult.value
    }
}

function processExpression(
    expression: Expression,
    reportResult?: { result: string } | undefined,
): any {
    let { target, operation, values } = expression
    const localReportResult = reportResult === undefined ? { result: "" } : reportResult
    // Step1, find target
    const root = findRootObject(target)
    const splitedTarget = target.split(".")
    let child: string
    let parent: any
    if (splitedTarget.length == 2) {
        parent = root
        child = splitedTarget[1]
    } else {
        parent = findBeforeTarget(splitedTarget.slice(1).join("."), root)
        child = splitedTarget.slice(-1)[0]
    }
    // Step2, compute value
    const computedValues = []
    for (let v of values) {
        if (isExpression(v)) computedValues.push(processExpression(v))
        else if (isValue(v)) {
            switch (v.type) {
                case "number":
                    computedValues.push(Number(v.value))
                    break
                case "boolean":
                    computedValues.push(v.value === "true" ? true : false)
                    break
                case "string":
                    computedValues.push(v.value)
            }
        }
        else computedValues.push(v)
    }
    // Step3, process operation
    switch (operation) {
        case "+=":
            parent[child] += computedValues[0]
            localReportResult.result = `+${computedValues[0]}`
            break
        case "-=":
            parent[child] -= computedValues[0]
            localReportResult.result = `-${computedValues[0]}`
            break
        case "=":
            parent[child] = computedValues[0]
            localReportResult.result = `=${computedValues[0]}`
            break
        case "+":
            return parent[child] + computedValues[0]
        case "-":
            return parent[child] - computedValues[0]
    }

}

export { processExpression }