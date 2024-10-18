function getById(id: string): any {
    return fetch(`/api/data/${id}`).then(res => res.json())
}

export {
    getById
}
