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

interface ProcessResult {
    target: Record<string, any>
    key: string
    values: (string | number | boolean)[]
    modificationType: "set" | "change" | "none"
    doReturn: boolean
}

// TODO: Only supports number (mostly), only support 1 value
function processExpression(
    expression: Expression
): ProcessResult {
    let { target, operation, values } = expression
    // Step1, find target
    const root = findRootObject(target)
    const splitedTarget = target.split(".")
    let child: string
    let parent: Record<string, any>
    if (splitedTarget.length == 2) {
        parent = root
        child = splitedTarget[1]
    } else {
        parent = findBeforeTarget(splitedTarget.slice(1).join("."), root)
        child = splitedTarget.slice(-1)[0]
    }
    let processResult: ProcessResult = {
        target: parent,
        key: child,
        values: [],
        modificationType: "none",
        doReturn: false
    }
    // Step2, compute value
    const computedValues = []
    for (let v of values) {
        if (isExpression(v)) {
            let { values } = processExpression(v)
            computedValues.push(values[0])
        } else if (isValue(v)) {
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
            processResult.values.push(computedValues[0])
            processResult.modificationType = "change"
            break
        case "-=":
            processResult.values.push(-Number(computedValues[0]))
            processResult.modificationType = "change"
            break
        case "=":
            processResult.values.push(computedValues[0])
            processResult.modificationType = "set"
            break
        case "+":
            processResult.values.push(parent[child] + computedValues[0])
            processResult.doReturn = true
            break
        case "-":
            processResult.values.push(parent[child] - Number(computedValues[0]))
            processResult.doReturn = true
            break
        case "<":
            processResult.values.push(parent[child] < computedValues[0])
            processResult.doReturn = true
            break
        case ">":
            processResult.values.push(parent[child] > computedValues[0])
            processResult.doReturn = true
            break
        case ">=":
            processResult.values.push(parent[child] >= computedValues[0])
            processResult.doReturn = true
            break
        case "<=":
            processResult.values.push(parent[child] <= computedValues[0])
            processResult.doReturn = true
            break
        case "==":
            processResult.values.push(parent[child] == computedValues[0])
            processResult.doReturn = true
            break
    }

    return processResult
}

export { processExpression }