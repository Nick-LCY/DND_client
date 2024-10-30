function getByDataType<T>(dataType: string, namespace: string = "_dnd5e"): Promise<Array<T>> {
    return fetch(`/api/data/${namespace}/${dataType}`).then(res => res.json())
}

export {
    getByDataType
}

