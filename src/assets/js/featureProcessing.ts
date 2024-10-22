import { Categories, Feature } from "./categories";
import { renderMD } from "./renderMarkdown";
interface ProcessedData {
    categories: Categories
    description: string
}

interface OriginalEffect {
    id: string
    name: string
    description: string
}

interface OriginalEffectSelection {
    choose: number
    available: Array<OriginalEffect>
}

interface OriginalFeature {
    id: string
    name: string
    description: string
    category: string
    effects?: OriginalEffectSelection
}

interface OriginalSubclass {
    features: Array<OriginalFeature>
}

interface OriginalSubrace {
    features: Array<OriginalFeature>
}


interface OriginalData {
    description: string
    features: Array<OriginalFeature>
    selectedSubclass?: OriginalSubclass
    selectedSubrace?: OriginalSubrace
}

function processFeatures(features: Array<OriginalFeature>): Categories {
    const categories: Categories = {};
    for (let feature of features) {
        if (!(feature.category in categories)) {
            categories[feature.category] = []
        }
        const data: Feature = {
            id: feature.id,
            name: feature.name,
            description: renderMD(feature.description)
        }
        if (feature.effects != undefined) {
            let effects = feature.effects
            if (Object.getPrototypeOf(effects) === Object.prototype) {
                data.selection = {
                    choose: effects.choose,
                    available: []
                }
                for (let effect of effects.available) {
                    data.selection.available.push({
                        id: effect.id,
                        name: effect.name,
                        description: renderMD(effect.description)
                    })
                }
            }
        }
        categories[feature.category].push(data)
    }
    return categories
}

function updateCategories(originalData: OriginalData): ProcessedData {
    let categories = processFeatures(originalData.features)
    if (originalData.selectedSubclass != undefined) {
        categories = {
            ...categories,
            ...processFeatures(originalData.selectedSubclass.features)
        }
    }
    if (originalData.selectedSubrace != undefined) {
        categories = {
            ...categories,
            ...processFeatures(originalData.selectedSubrace.features)
        }
    }
    return {
        categories: categories,
        description: renderMD(originalData.description)
    }
}

export { updateCategories, processFeatures }