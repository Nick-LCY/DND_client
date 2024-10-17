import { Categories, Feature } from "./categories";
import markdownit from 'markdown-it';
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
    available: Array<OriginalEffectWrapper>
}

interface OriginalEffectWrapper {
    type: string
    effect: OriginalEffect
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


interface OriginalData {
    description: string
    features: Array<OriginalFeature>
    selectedSubclass?: OriginalSubclass
}

function processFeatures(features: Array<OriginalFeature>): Categories {
    const categories: Categories = {};
    for (let feature of features) {
        if (!(feature.category in categories)) {
            categories[feature.category] = { data: [], collapse: false }
        }
        const data: Feature = {
            id: feature.id,
            name: feature.name,
            description: md.render(feature.description)
        }
        if (feature.effects != undefined) {
            let effects = feature.effects
            if (Object.getPrototypeOf(effects) === Object.prototype) {
                data.selection = {
                    choose: effects.choose,
                    available: []
                }
                for (let wrapper of effects.available) {
                    let effect = wrapper.effect
                    data.selection.available.push({
                        id: effect.id,
                        name: effect.name,
                        description: md.render(effect.description)
                    })
                }
            }
        }
        categories[feature.category].data.push(data)
    }
    return categories
}

const md = markdownit()
function updateCategories(originalData: OriginalData): ProcessedData {
    let categories = processFeatures(originalData.features)
    if (originalData.selectedSubclass != undefined) {
        categories = {
            ...categories,
            ...processFeatures(originalData.selectedSubclass.features)
        }
    }
    return {
        categories: categories,
        description: md.render(originalData.description)
    }
}

export { updateCategories }