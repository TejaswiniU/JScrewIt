type MaskTemplate = [number, number];

type Mask = Readonly<MaskTemplate>;

export default Mask;

export function maskAreEqual(mask1: Mask, mask2: Mask): boolean
{
    const equal = mask1[0] === mask2[0] && mask1[1] === mask2[1];
    return equal;
}

export function maskIncludes(includingMask: Mask, includedMask: Mask): boolean
{
    let part0;
    let part1;
    const included =
    (([part0] = includedMask, part0) & includingMask[0]) === part0 &&
    (([, part1] = includedMask, part1) & includingMask[1]) === part1;
    return included;
}

export function maskIntersection(mask1: Mask, mask2: Mask): Mask
{
    const mask: Mask = [mask1[0] & mask2[0], mask1[1] & mask2[1]];
    return mask;
}

export function maskIsEmpty(mask: Mask): boolean
{
    const empty = !(mask[0] | mask[1]);
    return empty;
}

export function maskNew(): Mask
{
    const mask: Mask = [0, 0];
    return mask;
}

export function maskUnion(mask1: Mask, mask2: Mask): Mask
{
    const mask: Mask = [mask1[0] | mask2[0], mask1[1] | mask2[1]];
    return mask;
}

export function maskWithBit(bitIndex: number): Mask
{
    const mask: MaskTemplate = [0, 0];
    mask[bitIndex >> 5] |= 1 << bitIndex;
    return mask;
}
