import { EffectGroup, EffectGroupDict, isEffectGroupDict } from "./originalDataType"

interface TypeIndex<T> {
    idx: number
    item: T
}

function filterByType<T>(
    array: EffectGroup | EffectGroupDict,
    determineFunc: (item: any) => item is T
): TypeIndex<T>[] {
    const selections: TypeIndex<T>[] = []
    let idx = 0
    if (isEffectGroupDict(array)) array = array.group
    for (let item of array) {
        if (!determineFunc(item)) continue
        selections.push({ idx, item })
        idx += 1
    }
    return selections
}

interface vModelSelection {
    selectedString: { id: string, value: number }[],
    selectedSelection: vModelSelection[],
    selectedGroup: vModelSelection[],
}

function isSelected(selection: vModelSelection): boolean {
    for (let selectedEffect of selection.selectedString) {
        if (selectedEffect.value > 0) return true
    }
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
    counter += selection.selectedString.reduce((o, n) => o + n.value, 0)
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