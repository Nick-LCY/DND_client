import { Feature as OriginalFeature } from "./originalDataType";
import { Categories, Feature } from "./categories";
import { renderMD } from "./renderMarkdown";
interface ProcessedData {
    categories: Categories
    description: string
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

function processFeatures(features: OriginalFeature[]): Categories {
    const categories: Categories = {};
    for (let feature of features) {
        if (!(feature.category in categories)) {
            categories[feature.category] = []
        }
        const data: Feature = {
            id: feature.id,
            name: feature.name,
            description: renderMD(feature.description),
            // Effect description rendering was done in EffectSelection.vue
            effects: feature.effects
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