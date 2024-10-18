function getById(id: string): any {
    if (id === "_dnd5e:classes.barbarian") {
        return import("../assets/test_json/_dnd5e:classes.barbarian.json")
    } else if (id === "_dnd5e:races.dwarf") {
        return import("../assets/test_json/_dnd5e:races.dwarf.json")
    } else if (id === "_dnd5e:backgrounds.acolyte") {
        return import("../assets/test_json/_dnd5e:backgrounds.acolyte.json")
    } else {
        return import("../assets/test_json/_dnd5e:races.half_orc.json")
    }
}

export {
    getById
}
