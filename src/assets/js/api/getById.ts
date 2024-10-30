function getById<T>(id: string): Promise<T> {
    return fetch(`/api/data/${id}`).then(res => res.json())
}

export {
    getById
}
