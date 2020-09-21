export default {
    matchingMethods: {
        'EXACT': {
            description: 'Exact match',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: false,
            items: [],
        },
        'INTERMEDIATE': {
            description: 'Intermediate dataset',
            acceptsSimilarityMethod: true,
            isSimilarityMethod: false,
            items: [
                {
                    key: 'entity_type_selection',
                    label: 'Intermediate dataset',
                    type: 'entity_type_selection',
                },
                {
                    key: 'intermediate_source',
                    label: 'Source',
                    type: 'property',
                    defaultValue: [''],
                    entity_type_selection_key: 'entity_type_selection',
                },
                {
                    key: 'intermediate_target',
                    label: 'Target',
                    type: 'property',
                    defaultValue: [''],
                    entity_type_selection_key: 'entity_type_selection',
                }
            ],
        },
        'LEVENSHTEIN_DISTANCE': {
            description: 'Levenshtein distance',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: true,
            items: [
                {
                    key: 'max_distance',
                    label: 'Maximum distance',
                    type: 'number',
                    defaultValue: 1,
                    minValue: 0,
                }
            ],
        },
        'LEVENSHTEIN_NORMALIZED': {
            description: 'Levenshtein normalized',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: true,
            items: [
                {
                    key: 'threshold',
                    label: 'Similarity threshold',
                    type: 'number',
                    defaultValue: 0.7,
                    minValue: 0,
                    maxValue: 1,
                }
            ]
        },
        'SOUNDEX': {
            description: 'Soundex',
            acceptsSimilarityMethod: true,
            isSimilarityMethod: false,
            items: [
                {
                    key: 'size',
                    label: 'Soundex size',
                    type: 'number',
                    defaultValue: 4,
                    minValue: 1,
                    maxValue: 5,
                }
            ]
        },
        'BLOOTHOOFT': {
            description: 'Gerrit Bloothooft',
            acceptsSimilarityMethod: true,
            isSimilarityMethod: false,
            items: [
                {
                    key: 'name_type',
                    label: 'Type of name',
                    type: 'choices',
                    choices: {
                        'First name': 'first_name',
                        'Family name': 'family_name',
                    },
                }
            ]
        },
        'NYSIIS': {
            description: 'New York State Identification and Intelligence System (NYSIIS)',
            acceptsSimilarityMethod: true,
            isSimilarityMethod: false,
            items: []
        },
        'WORD_INTERSECTION': {
            description: 'Word Intersection',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: true,
            items: [
                {
                    key: 'ordered',
                    label: 'Keep the order of the words',
                    type: 'boolean',
                    defaultValue: false,
                },
                {
                    key: 'approximate',
                    label: 'Each word should be approximated',
                    type: 'boolean',
                    defaultValue: true,
                },
                {
                    key: 'stop_symbols',
                    label: 'Stop symbols',
                    type: 'string',
                    defaultValue: '.-,+\'?;()–',
                },
                {
                    key: 'threshold',
                    label: 'Similarity threshold',
                    type: 'number',
                    defaultValue: 0.7,
                    minValue: 0,
                    maxValue: 1,
                }
            ]
        },
        'METAPHONE': {
            description: 'Metaphone',
            acceptsSimilarityMethod: true,
            isSimilarityMethod: false,
            items: [
                {
                    key: 'max',
                    label: 'Maximum size',
                    type: 'number',
                    defaultValue: 20,
                    minValue: 1,
                    maxValue: 255,
                }
            ]
        },
        'DMETAPHONE': {
            description: 'Double Metaphone',
            acceptsSimilarityMethod: true,
            isSimilarityMethod: false,
            items: []
        },
        'TRIGRAM': {
            description: 'Trigram',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: true,
            items: [
                {
                    key: 'threshold',
                    label: 'Similarity threshold',
                    type: 'number',
                    defaultValue: 0.3,
                    minValue: 0,
                    maxValue: 1,
                }
            ]
        },
        'NUMBERS_DELTA': {
            description: 'Numbers Delta',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: false,
            items: [
                {
                    key: 'type',
                    label: 'Size difference',
                    type: 'choices',
                    choices: {
                        'Irrelevant': '<>',
                        'Source < Target': '<',
                        'Source > Target': '>',
                    },
                },
                {
                    key: 'start',
                    label: 'Start',
                    type: 'number',
                    defaultValue: 0,
                },
                {
                    key: 'end',
                    label: 'End',
                    type: 'number',
                    defaultValue: 0,
                }
            ]
        },
        'TIME_DELTA': {
            description: 'Time Delta',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: false,
            items: [
                {
                    key: 'type',
                    label: 'Should occur before or after?',
                    type: 'choices',
                    choices: {
                        'Irrelevant': '<>',
                        'Source event before target event': '<',
                        'Source event after target event': '>',
                    },
                },
                {
                    key: 'years',
                    label: 'Years',
                    type: 'number',
                    defaultValue: 0,
                    minValue: 0,
                },
                {
                    key: 'months',
                    label: 'Months',
                    type: 'number',
                    defaultValue: 0,
                    minValue: 0,
                },
                {
                    key: 'days',
                    label: 'Days',
                    type: 'number',
                    defaultValue: 0,
                    minValue: 0,
                },
                {
                    key: 'format',
                    label: 'Date format',
                    type: 'YYYY-MM-DD'
                }
            ]
        },
        'SAME_YEAR_MONTH': {
            description: 'Same Year/Month',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: false,
            items: [
                {
                    key: 'date_part',
                    label: 'Same Year/Month?',
                    type: 'choices',
                    choices: {
                        'Year': 'year',
                        'Month': 'month',
                        'Year and Month': 'year_month',
                    }
                }
            ]
        },
        'JARO': {
            description: 'Jaro',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: true,
            items: [
                {
                    key: 'threshold',
                    label: 'Similarity threshold',
                    type: 'number',
                    defaultValue: 0.7,
                    minValue: 0,
                    maxValue: 1,
                }
            ]
        },
        'JARO_WINKLER': {
            description: 'Jaro-Winkler',
            acceptsSimilarityMethod: false,
            isSimilarityMethod: true,
            items: [
                {
                    key: 'threshold',
                    label: 'Similarity threshold',
                    type: 'number',
                    defaultValue: 0.7,
                    minValue: 0,
                    maxValue: 1,
                },
                {
                    key: 'prefix_weight',
                    label: 'Prefix weight',
                    type: 'number',
                    defaultValue: 0.1,
                    minValue: 0,
                    maxValue: 1,
                }
            ]
        },
    },
    transformers: {
        'ECARTICO_FULL_NAME': {
            label: 'Ecartico full name',
            items: []
        },
        'PREFIX': {
            label: 'Prefix',
            items: [{
                key: 'prefix',
                label: 'Prefix with',
                defaultValue: '',
                allowEmptyValue: false
            }]
        },
        'SUFFIX': {
            label: 'Suffix',
            items: [{
                key: 'suffix',
                label: 'Suffix with',
                defaultValue: '',
                allowEmptyValue: false
            }]
        },
        'REPLACE': {
            label: 'Replace',
            items: [{
                key: 'from',
                label: 'From',
                defaultValue: '',
                allowEmptyValue: false
            }, {
                key: 'to',
                label: 'To',
                defaultValue: '',
                allowEmptyValue: true
            }]
        }
    },
    tNorms: {
        MINIMUM_T_NORM: 'Minimum t-norm (⊤min)',
        PRODUCT_T_NORM: 'Product t-norm (⊤prod)',
        LUKASIEWICZ_T_NORM: 'Łukasiewicz t-norm (⊤Luk)',
        DRASTIC_T_NORM: 'Drastic t-norm (⊤D)',
        NILPOTENT_MINIMUM: 'Nilpotent minimum (⊤nM)',
        HAMACHER_PRODUCT: 'Hamacher product (⊤H0)',
    },
    tConorms: {
        MAXIMUM_T_CONORM: 'Maximum t-conorm (⊥max)',
        PROBABILISTIC_SUM: 'Probabilistic sum (⊥sum)',
        BOUNDED_SUM: 'Bounded sum (⊥Luk)',
        DRASTIC_T_CONORM: 'Drastic t-conorm (⊥D)',
        NILPOTENT_MAXIMUM: 'Nilpotent maximum (⊥nM)',
        EINSTEIN_SUM: 'Einstein sum (⊥H2)',
    },
    linksetOptions: {
        MINIMUM_T_NORM: 'Minimum t-norm (⊤min)',
        PRODUCT_T_NORM: 'Product t-norm (⊤prod)',
        LUKASIEWICZ_T_NORM: 'Łukasiewicz t-norm (⊤Luk)',
        DRASTIC_T_NORM: 'Drastic t-norm (⊤D)',
        NILPOTENT_MINIMUM: 'Nilpotent minimum (⊤nM)',
        HAMACHER_PRODUCT: 'Hamacher product (⊤H0)',
        MAXIMUM_T_CONORM: 'Maximum t-conorm (⊥max)',
        PROBABILISTIC_SUM: 'Probabilistic sum (⊥sum)',
        BOUNDED_SUM: 'Bounded sum (⊥Luk)',
        DRASTIC_T_CONORM: 'Drastic t-conorm (⊥D)',
        NILPOTENT_MAXIMUM: 'Nilpotent maximum (⊥nM)',
        EINSTEIN_SUM: 'Einstein sum (⊥H2)',
    },
    linksetOptionGroups: {
        'All conditions must be met (AND)': ['MINIMUM_T_NORM', 'PRODUCT_T_NORM', 'LUKASIEWICZ_T_NORM',
            'DRASTIC_T_NORM', 'NILPOTENT_MINIMUM', 'HAMACHER_PRODUCT'],
        'At least one of the conditions must be met (OR)': ['MAXIMUM_T_CONORM', 'PROBABILISTIC_SUM', 'BOUNDED_SUM',
            'DRASTIC_T_CONORM', 'NILPOTENT_MAXIMUM', 'EINSTEIN_SUM'],
    },
    lensOptions: {
        UNION: 'Union (A ∪ B)',
        INTERSECTION: 'Intersection (A ∩ B)',
        DIFFERENCE: 'Difference (A - B)',
        SYM_DIFFERENCE: 'Symmetric difference (A ∆ B)',
        IN_SET_AND: 'Source and target resources match',
        IN_SET_OR: 'Source or target resources match',
        IN_SET_SOURCE: 'Source resources match',
        IN_SET_TARGET: 'Target resources match'
    },
    lensOptionGroups: {
        'Operations on links': ['UNION', 'INTERSECTION', 'DIFFERENCE', 'SYM_DIFFERENCE'],
        'Operations on link resources': ['IN_SET_AND', 'IN_SET_OR', 'IN_SET_SOURCE', 'IN_SET_TARGET'],
    },
    lensOptionDescriptions: {
        UNION: 'All links of both linksets/lenses',
        INTERSECTION: 'Only links that appear in both linksets/lenses',
        DIFFERENCE: 'Only links from the first linkset/lens, not from the second linkset/lens',
        SYM_DIFFERENCE: 'Only links which appear in either one linkset/lens, but not both',
        IN_SET_AND: 'Both the source and target resource from the first linkset/lens must appear in the the set of resources from the second linkset/lens',
        IN_SET_OR: 'Either the source or the target resource from the first linkset/lens must appear in the the set of resources from the second linkset/lens',
        IN_SET_SOURCE: 'The source resource from the first linkset/lens must appear in the the set of resources from the second linkset/lens',
        IN_SET_TARGET: 'The target resource from the first linkset/lens must appear in the the set of resources from the second linkset/lens'
    },
};