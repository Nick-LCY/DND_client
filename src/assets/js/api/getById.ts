import { Race } from "../originalDataType"
function getById(id: string): Promise<Race> {
    return fetch(`/api/data/${id}`).then(res => res.json())
}

export {
    getById
}
