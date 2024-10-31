import { EffectGroup } from "./originalDataType"

interface TypeIndex<T> {
    idx: number
    item: T
}

function filterByType<T>(
    array: EffectGroup,
    determineFunc: (item: any) => item is T
): TypeIndex<T>[] {
    const selections: TypeIndex<T>[] = []
    let idx = 0
    for (let item of array) {
        if (!determineFunc(item)) continue
        selections.push({ idx, item })
        idx += 1
    }
    return selections
}

interface vModelSelection {
    selectedString: string[],
    selectedSelection: vModelSelection[],
    selectedGroup: vModelSelection[],
}

function isSelected(selection: vModelSelection): boolean {
    if (selection.selectedString.length > 0) return true
    for (let group of selection.selectedGroup) {
        if (isSelected(group)) return true
    }
    for (let subSelection of selection.selectedSelection) {
        if (isSelected(subSelection)) return true
    }
    return false
}

function selectedCount(selection: vModelSelection): number {
    let counter = 0
    counter += selection.selectedString.length
    for (let group of selection.selectedGroup) {
        if (isSelected(group)) counter += 1
    }
    for (let subSelection of selection.selectedSelection) {
        if (isSelected(subSelection)) counter += 1
    }
    return counter
}
export type { vModelSelection }
export { filterByType, isSelected, selectedCount }