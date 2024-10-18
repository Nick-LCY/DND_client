function getByDataType(dataType: string, namespace: string = "_dnd5e") {
    return fetch(`/api/data/${namespace}/${dataType}`).then(res => res.json())
}

export {
    getByDataType
}

