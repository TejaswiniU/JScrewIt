import { Feature, featuresToMask }  from './features';
import Mask, { maskUnion }          from './mask';
import { _Array_prototype }         from './obj-utils';

export interface DefinitionEntry<T> { readonly definition: T; readonly mask: Mask; }

export type DefinitionEntryList<T> = readonly DefinitionEntry<T>[];

function createDefinitionEntry<T>(definition: T, mask: Mask): DefinitionEntry<T>
{
    const entry = { definition, mask };
    return entry;
}

export const define =
function <T>(definition: T): DefinitionEntry<T>
{
    const entry = defineWithArrayLike(definition, arguments, 1);
    return entry;
} as <T>(definition: T, ...features: Feature[]) => DefinitionEntry<T>;

export function defineList<T>
(availableEntries: DefinitionEntryList<T>, indexEntries: DefinitionEntryList<number>):
DefinitionEntryList<T> & { readonly available: DefinitionEntryList<T>; }
{
    const effectiveEntries =
    indexEntries.map
    (
        (indexEntry: DefinitionEntry<number>): DefinitionEntry<T> =>
        {
            const availableEntry = availableEntries[indexEntry.definition];
            const { definition } = availableEntry;
            const mask = maskUnion(indexEntry.mask, availableEntry.mask);
            const effectiveEntry = createDefinitionEntry(definition, mask);
            return effectiveEntry;
        },
    ) as DefinitionEntry<T>[] & { available: DefinitionEntryList<T>; };
    effectiveEntries.available = availableEntries;
    return effectiveEntries;
}

export function defineWithArrayLike<T>
(definition: T, featureArgs: ArrayLike<Feature>, startIndex: number): DefinitionEntry<T>
{
    const features = _Array_prototype.slice.call(featureArgs, startIndex);
    const mask = featuresToMask(features);
    const entry = createDefinitionEntry(definition, mask);
    return entry;
}
