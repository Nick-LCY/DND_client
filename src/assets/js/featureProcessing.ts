import { Feature as OriginalFeature, LeveledFeature } from "./originalDataType";
import { Categories, ConditionalFeature, Feature } from "./categories";
import { renderMD } from "./renderMarkdown";
import { Ref } from "vue";

function processFeatures(features: OriginalFeature[], sources: string[]): Categories {
    const categories: Categories = {};
    for (let feature of features) {
        if (!(feature.category in categories)) {
            categories[feature.category] = []
        }
        const data: Feature = {
            id: feature.id,
            name: feature.name,
            description: renderMD(feature.description),
            // Effect description rendering is done in EffectSelection.vue
            effects: feature.effects,
            sources
        }
        categories[feature.category].push(data)
    }
    return categories
}

function processLeveledFeatures(features: LeveledFeature[], selectionProxy: Ref<{ level: number }>, sources: string[]): Categories {
    const categories: Categories = {};
    for (let leveledFeature of features) {
        let feature = leveledFeature.feature
        let conditionalFeature: ConditionalFeature = {
            id: feature.id,
            name: feature.name,
            description: renderMD(feature.description),
            // Effect description rendering is done in EffectSelection.vue
            effects: feature.effects,
            condition: () => {
                return selectionProxy.value.level >= leveledFeature.start_level
                    && (
                        leveledFeature.end_level === undefined
                        || selectionProxy.value.level < leveledFeature.end_level
                    )
            },
            sources
        }
        if (!(feature.category in categories)) {
            categories[feature.category] = []
        }
        categories[feature.category].push(conditionalFeature)
    }
    return categories
}

function mergeCategories(...categoriesList: Categories[]): Categories {
    const finalCategories: Categories = {}
    for (let categories of categoriesList) {
        for (let category in categories) {
            if (!(category in finalCategories)) finalCategories[category] = []
            finalCategories[category].push(...categories[category])
        }
    }
    return finalCategories
}

export {
    processFeatures,
    processLeveledFeatures,
    mergeCategories
}