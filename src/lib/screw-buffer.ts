import createClusteringPlan, { Cluster, ClusteringPlan }    from './clustering-plan';
import Level                                                from './level';
import { _Math_max, _Math_pow, assignNoEnum }               from './obj-utils';
import Solution                                             from './solution';

// This implementation assumes that all numeric solutions have an outer plus, and all other
// character solutions have none.

interface Optimizer
{
    appendLengthOf(solution: Solution): number;
    optimizeSolutions
    (plan: ClusteringPlan, solutions: Solution[], bond?: boolean, forceString?: boolean): void;
}

interface ScrewBuffer
{
    readonly length: number;
    append(solution: Solution): boolean;
}

type ScrewBufferConstructor =
new
(
    bond: boolean,
    forceString: boolean,
    groupThreshold: number,
    optimizerList: readonly Optimizer[],
) =>
ScrewBuffer;

export const APPEND_LENGTH_OF_DIGIT_0   = 6;
export const APPEND_LENGTH_OF_DOT       = 73;
export const APPEND_LENGTH_OF_FALSE     = 4;
export const APPEND_LENGTH_OF_EMPTY     = 3; // Append length of the empty array.
export const APPEND_LENGTH_OF_MINUS     = 136;
export const APPEND_LENGTH_OF_PLUS_SIGN = 71;
export const APPEND_LENGTH_OF_SMALL_E   = 26;

export const APPEND_LENGTH_OF_DIGITS =
[APPEND_LENGTH_OF_DIGIT_0, 8, 12, 17, 22, 27, 32, 37, 42, 47];

export let ScrewBuffer: ScrewBufferConstructor;

export let optimizeSolutions:
(
    optimizerList: readonly Optimizer[],
    solutions: Solution[],
    bond?: boolean,
    forceString?: boolean,
) =>
void;

((): void =>
{
    function canSplitRightEndForFree
    (solutions: readonly Solution[], lastBridgeIndex: number): boolean
    {
        const rightEndIndex = lastBridgeIndex + 1;
        const rightEndLength = solutions.length - rightEndIndex;
        const result =
        rightEndLength > 2 || rightEndLength > 1 && !isUnluckyRightEnd(solutions, rightEndIndex);
        return result;
    }

    function findLastBridge(solutions: readonly Solution[]): number | undefined
    {
        for (let index = solutions.length; index--;)
        {
            const { bridge } = solutions[index];
            if (bridge)
                return index;
        }
    }

    function findNextBridge(solutions: readonly Solution[], index: number): number
    {
        for (;; ++index)
        {
            const { bridge } = solutions[index];
            if (bridge)
                return index;
        }
    }

    function findSplitIndex
    (
        solutions: readonly Solution[],
        intrinsicSplitCost: number,
        firstBridgeIndex: number,
        lastBridgeIndex: number,
    ):
    number | undefined
    {
        let index = 1;
        const lastIndex = firstBridgeIndex - 1;
        let optimalSplitCost = getSplitCostAt(solutions, index, true, index === lastIndex);
        let splitIndex = index;
        while (++index < firstBridgeIndex)
        {
            const splitCost = getSplitCostAt(solutions, index, false, index === lastIndex);
            if (splitCost < optimalSplitCost)
            {
                optimalSplitCost = splitCost;
                splitIndex = index;
            }
        }
        if
        (
            optimalSplitCost + intrinsicSplitCost < 0 &&
            !(optimalSplitCost > 0 && canSplitRightEndForFree(solutions, lastBridgeIndex))
        )
            return splitIndex;
    }

    function gatherGroup
    (
        solutions: readonly Solution[],
        groupBond?: boolean,
        groupForceString?: boolean,
        bridgeUsed?: boolean,
    ):
    string
    {
        function appendRightGroup(groupCount: number): void
        {
            array.push(sequenceAsString(solutions, index!, groupCount, '[[]]'), ')');
        }

        let array: (string | Solution)[];
        let index: number | undefined;
        let multiPart: boolean;
        let notStr: boolean;
        const count = solutions.length;
        if (count > 1)
        {
            let lastBridgeIndex: number | undefined;
            if (bridgeUsed)
                lastBridgeIndex = findLastBridge(solutions);
            multiPart = lastBridgeIndex == null;
            if (multiPart)
                array = sequence(solutions, 0, count);
            else
            {
                let bridgeIndex = findNextBridge(solutions, 0);
                if (bridgeIndex as any > 1)
                {
                    const intrinsicSplitCost = groupForceString ? -3 : groupBond ? 2 : 0;
                    index =
                    findSplitIndex(solutions, intrinsicSplitCost, bridgeIndex, lastBridgeIndex!);
                }
                multiPart = index != null;
                if (multiPart)
                {
                    // Keep the first solutions out of the concat context to reduce output length.
                    const preBridgeCount = index!;
                    array =
                    preBridgeCount > 1 ? sequence(solutions, 0, preBridgeCount) : [solutions[0]];
                    array.push('+');
                }
                else
                {
                    array = [];
                    index = 0;
                }
                array.push
                ('[', sequenceAsString(solutions, index!, bridgeIndex - index!, '[]'), ']');
                for (;;)
                {
                    array.push(solutions[bridgeIndex].bridge!, '(');
                    index = bridgeIndex + 1;
                    if (bridgeIndex === lastBridgeIndex)
                        break;
                    bridgeIndex = findNextBridge(solutions, index);
                    appendRightGroup(bridgeIndex - index);
                }
                let groupCount: number;
                const rightEndCount = count - index;
                if (groupForceString && !multiPart && rightEndCount > 1)
                {
                    groupCount = rightEndCount > 2 && isUnluckyRightEnd(solutions, index) ? 2 : 1;
                    multiPart = true;
                }
                else
                    groupCount = rightEndCount;
                appendRightGroup(groupCount);
                index += groupCount - 1;
                while (++index < count)
                    pushSolution(array, solutions[index]);
            }
            notStr = !multiPart;
        }
        else
        {
            const [solution] = solutions;
            array = [solution];
            multiPart = false;
            notStr = solution.level < Level.STRING;
        }
        if (notStr && groupForceString)
        {
            array.push('+[]');
            multiPart = true;
        }
        let str = array.join('');
        if (groupBond && multiPart)
            str = `(${str})`;
        return str;
    }

    function getNumericJoinCost(level0: Level, level1: Level): number
    {
        const joinCost = level0 > Level.UNDEFINED || level1 > Level.UNDEFINED ? 2 : 3;
        return joinCost;
    }

    function getSplitCostAt
    (solutions: readonly Solution[], index: number, leftmost: boolean, rightmost: boolean): number
    {
        const solutionCenter = solutions[index];
        const levelCenter = solutionCenter.level;
        let levelLeft: Level;
        let levelRight: Level;
        let solutionRight: Solution;
        const splitCost =
        (
            rightmost && levelCenter < Level.NUMERIC ?
            3 :
            isNumericJoin(levelCenter, levelRight = (solutionRight = solutions[index + 1]).level) ?
            getNumericJoinCost(levelCenter, levelRight) - (solutionRight.hasOuterPlus ? 2 : 0) :
            0
        ) -
        (
            leftmost &&
            isNumericJoin(levelCenter, levelLeft = solutions[index - 1].level) ?
            getNumericJoinCost(levelLeft, levelCenter) :
            solutionCenter.hasOuterPlus ? 2 : 0
        );
        return splitCost;
    }

    function isNumericJoin(level0: Level, level1: Level): boolean
    {
        const result = level0 < Level.OBJECT && level1 < Level.OBJECT;
        return result;
    }

    function isUnluckyRightEnd(solutions: readonly Solution[], firstIndex: number): boolean
    {
        const result =
        solutions[firstIndex].level < Level.NUMERIC &&
        solutions[firstIndex + 1].level > Level.UNDEFINED;
        return result;
    }

    function pushSolution(array: (Solution | string)[], solution: Solution): void
    {
        if (solution.hasOuterPlus)
            array.push('+(', solution, ')');
        else
            array.push('+', solution);
    }

    function sequence
    (solutions: readonly Solution[], offset: number, count: number): (Solution | string)[]
    {
        let array: (Solution | string)[];
        const solution0 = solutions[offset];
        const solution1 = solutions[offset + 1];
        if (solution0.level < Level.OBJECT && solution1.level < Level.OBJECT)
        {
            if (solution1.level > Level.UNDEFINED)
                array = [solution0, '+[', solution1, ']'];
            else if (solution0.level > Level.UNDEFINED)
                array = ['[', solution0, ']+', solution1];
            else
                array = [solution0, '+[]+', solution1];
        }
        else
        {
            array = [solution0];
            pushSolution(array, solution1);
        }
        for (let index = 2; index < count; ++index)
        {
            const solution = solutions[offset + index];
            pushSolution(array, solution);
        }
        return array;
    }

    function sequenceAsString
    (solutions: readonly Solution[], offset: number, count: number, emptyReplacement: string):
    string
    {
        let str: string;
        if (count)
        {
            if (count > 1)
                str = sequence(solutions, offset, count).join('');
            else
            {
                const solution = solutions[offset];
                str = solution + (solution.level < Level.NUMERIC ? '+[]' : '');
            }
        }
        else
            str = emptyReplacement;
        return str;
    }

    const EMPTY_SOLUTION = new Solution('[]', Level.OBJECT, false);

    ScrewBuffer =
    function
    (
        this: ScrewBuffer,
        bond: boolean,
        forceString: boolean,
        groupThreshold: number,
        optimizerList: readonly Optimizer[],
    ):
    void
    {
        function gather
        (offset: number, count: number, groupBond?: boolean, groupForceString?: boolean): string
        {
            const end = offset + count;
            const groupSolutions = solutions.slice(offset, end);
            if (optimizerList.length)
                optimizeSolutions(optimizerList, groupSolutions, groupBond, groupForceString);
            const str = gatherGroup(groupSolutions, groupBond, groupForceString, bridgeUsed);
            return str;
        }

        let bridgeUsed: boolean;
        let length = -APPEND_LENGTH_OF_EMPTY;
        const maxSolutionCount = _Math_pow(2, groupThreshold - 1);
        const solutions: Solution[] = [];

        assignNoEnum
        (
            this,
            {
                append(solution: Solution): boolean
                {
                    if (solutions.length >= maxSolutionCount)
                        return false;
                    if (solution.bridge)
                        bridgeUsed = true;
                    solutions.push(solution);
                    let { appendLength } = solution;
                    optimizerList.forEach
                    (
                        (optimizer: Optimizer): void =>
                        {
                            const currentAppendLength = optimizer.appendLengthOf(solution);
                            if (currentAppendLength < appendLength)
                                appendLength = currentAppendLength;
                        },
                    );
                    length += appendLength;
                    return true;
                },
                get length(): number
                {
                    return length;
                },
                toString(): string
                {
                    function collectOut
                    (offset: number, count: number, maxGroupCount: number, groupBond?: boolean):
                    string
                    {
                        let str: string;
                        if (count <= groupSize + 1)
                            str = gather(offset, count, groupBond);
                        else
                        {
                            maxGroupCount /= 2;
                            const halfCount = groupSize * maxGroupCount;
                            const capacity = 2 * halfCount - count;
                            const leftEndCount =
                            _Math_max
                            (
                                halfCount - capacity + capacity % (groupSize - 1),
                                (maxGroupCount / 2 ^ 0) * (groupSize + 1),
                            );
                            const leftStr = collectOut(offset, leftEndCount, maxGroupCount);
                            const rightStr =
                            collectOut
                            (offset + leftEndCount, count - leftEndCount, maxGroupCount, true);
                            str = `${leftStr}+${rightStr}`;
                            if (groupBond)
                                str = `(${str})`;
                        }
                        return str;
                    }

                    let groupSize: number;
                    let str: string;
                    const solutionCount = solutions.length;
                    if (solutionCount < 2)
                    {
                        const solution = solutions[0] || EMPTY_SOLUTION;
                        const multiPart = forceString && solution.level < Level.STRING;
                        str = solution.replacement;
                        if (multiPart)
                            str += '+[]';
                        if
                        (
                            bond &&
                            (multiPart || solution.hasOuterPlus || solution.charAt(0) === '!')
                        )
                            str = `(${str})`;
                    }
                    else
                    {
                        if (solutionCount <= groupThreshold)
                            str = gather(0, solutionCount, bond, forceString);
                        else
                        {
                            groupSize = groupThreshold;
                            let maxGroupCount = 2;
                            for (;;)
                            {
                                --groupSize;
                                const maxSolutionCountForDepth = groupSize * maxGroupCount;
                                if (solutionCount <= maxSolutionCountForDepth)
                                    break;
                                maxGroupCount *= 2;
                            }
                            str = collectOut(0, solutionCount, maxGroupCount, bond);
                        }
                    }
                    return str;
                },
            },
        );
    } as
    unknown as ScrewBufferConstructor;

    optimizeSolutions =
    function
    (
        optimizerList: readonly Optimizer[],
        solutions: Solution[],
        bond?: boolean,
        forceString?: boolean,
    ):
    void
    {
        const plan = createClusteringPlan();
        optimizerList.forEach
        (
            (optimizer: Optimizer): void =>
            optimizer.optimizeSolutions(plan, solutions, bond, forceString),
        );
        const clusters = plan.conclude();
        clusters.forEach
        (
            (cluster: Cluster): void =>
            {
                const clusterer = cluster.data as () => Solution;
                const solution = clusterer();
                solutions.splice(cluster.start, cluster.length, solution);
            },
        );
    };
}
)();
