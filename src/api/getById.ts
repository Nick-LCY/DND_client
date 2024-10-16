function getById(id: string) {
    return import(`./${id}.json`)
}

export {
    getById
}
