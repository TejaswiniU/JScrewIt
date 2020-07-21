#!/usr/bin/env node

'use strict';

const JScrewIt  = require('..');
const chalk     = require('chalk');

require('../tools/text-utils');
const timeUtils = require('../tools/time-utils');

function checkMinInputLength(features, createInput, strategies, strategy, minLength)
{
    function checkOtherStrategies(inputData)
    {
        let tooSmall = false;
        const { length } = strategy.call(encoder, inputData);
        for (const strategyName of strategyNames)
        {
            const thisStrategy = strategies[strategyName];
            if (thisStrategy !== strategy)
            {
                const thisLength = thisStrategy.call(encoder, inputData).length;
                const diff = thisLength - length;
                let diffStr;
                if (diff > 0)
                    diffStr = `+${diff}`;
                else
                {
                    diffStr = chalk.bold(diff);
                    tooSmall = true;
                }
                console.log('%s%s', strategyName.padEnd(25), diffStr);
            }
        }
        if (tooSmall)
        {
            ok = false;
            logWarn('MIN_INPUT_LENGTH is too small.');
        }
    }

    function findBestStrategy(inputData)
    {
        let bestStrategyName;
        let bestLength = Infinity;
        for (const strategyName of strategyNames)
        {
            const thisStrategy = strategies[strategyName];
            if (thisStrategy !== strategy)
            {
                const { length } = thisStrategy.call(encoder, inputData);
                if (length < bestLength)
                {
                    bestStrategyName = strategyName;
                    bestLength = length;
                }
            }
        }
        const result = { strategyName: bestStrategyName, length: bestLength };
        return result;
    }

    const encoder = JScrewIt.debug.createEncoder(features);
    const inputDataShort = Object(createInput(minLength - 1));
    const inputDataFit = Object(createInput(minLength));
    const strategyNames = Object.keys(strategies).filter(isRivalStrategyName);
    let ok = true;
    checkOtherStrategies(inputDataFit);
    const outputShort = strategy.call(encoder, inputDataShort);
    const bestDataShort = findBestStrategy(inputDataShort);
    if (bestDataShort.length > outputShort.length)
    {
        ok = false;
        logWarn(`MIN_INPUT_LENGTH is too large for ${bestDataShort.strategyName}.`);
    }
    if (ok)
        logOk('MIN_INPUT_LENGTH is ok.');
}

function compareRoutineNames(name1, name2)
{
    const result = isCapital(name2) - isCapital(name1);
    if (result)
        return result;
    if (name1 > name2)
        return 1;
    if (name1 < name2)
        return -1;
    return 0;
}

function createAnalyzer()
{
    require('./solution-book-map').load();
    const Analyzer = require('./optimized-analyzer');

    const analyzer = new Analyzer();
    return analyzer;
}

function getOptimalityInfo(encoder, inputList, replaceVariant)
{
    function considerInput(entry)
    {
        if (!encoder.hasFeatures(entry.mask))
            return;
        const { definition } = entry;
        const solution = replaceVariant(encoder, definition);
        const { length } = solution;
        if (length <= optimalLength)
        {
            if (length < optimalLength)
            {
                optimalDefinitions = [];
                optimalLength = length;
            }
            optimalDefinitions.push(definition);
        }
        lengthMap[definition] = length;
    }

    let optimalDefinitions;
    const lengthMap = { __proto__: null };
    let optimalLength = Infinity;
    inputList.forEach(considerInput);
    const optimalityInfo = { lengthMap, optimalDefinitions, optimalLength };
    return optimalityInfo;
}

function isCapital(name)
{
    const capital = name.toUpperCase() === name;
    return capital;
}

function isRivalStrategyName(strategyName)
{
    return strategyName !== 'express' && strategyName !== 'text';
}

function logOk(str)
{
    console.log(chalk.green(str));
}

function logWarn(str)
{
    console.log(chalk.yellow(str));
}

function main()
{
    const [,, routineName] = process.argv;
    if (routineName != null)
    {
        const routine = verify[routineName];
        if (routine)
        {
            const duration = timeUtils.timeThis(routine);
            const durationStr = timeUtils.formatDuration(duration);
            console.log('%s elapsed.', durationStr);
            return;
        }
    }
    printHelpMessage();
}

function mismatchCallback(...args)
{
    args.forEach(logWarn);
}

function printHelpMessage()
{
    console.error
    (
        Object.keys(verify).sort(compareRoutineNames).reduce
        (
            (str, routineName) => `${str}\n• ${routineName}`,
            'Please, specify one of the implemented verification routines:',
        ),
    );
}

function verifyComplex(complex, entry)
{
    let encoder;
    const analyzer = createAnalyzer();
    const entryMask = entry.mask;
    const { definition } = entry;
    while (encoder = analyzer.nextEncoder)
    {
        if (encoder.hasFeatures(entryMask))
        {
            const complexSolution = encoder.resolve(definition, complex);
            const options = { bond: true, optimize: { toStringOpt: true } };
            const replacement = encoder.replaceString(complex, options);
            if (complexSolution.length < replacement.length)
                return true;
        }
    }
    return false;
}

function verifyDefinitions
(entries, inputList, mismatchCallback, replaceVariant, formatVariant)
{
    const progress = require('./progress');

    let encoder;
    let mismatchCount = 0;
    const analyzer = createAnalyzer();
    progress
    (
        'Scanning definitions',
        bar =>
        {
            while (encoder = analyzer.nextEncoder)
            {
                const optimalityInfo = getOptimalityInfo(encoder, inputList, replaceVariant);
                analyzer.stopCapture();
                const { lengthMap } = optimalityInfo;
                const actualDefinition = encoder.findDefinition(entries);
                const actualLength = lengthMap[actualDefinition];
                if (actualLength == null)
                    throw Error('No available definition matches');
                const { optimalLength } = optimalityInfo;
                if (lengthMap[actualDefinition] > optimalLength)
                {
                    const featureNames = analyzer.featureObj.canonicalNames;
                    const { optimalDefinitions } = optimalityInfo;
                    optimalDefinitions.sort();
                    mismatchCallback
                    (
                        `${++mismatchCount}.`,
                        featureNames.join(', '),
                        formatVariant(actualDefinition),
                        `(${lengthMap[actualDefinition]})`,
                        optimalDefinitions.map(formatVariant),
                        `(${optimalLength})`,
                        '\x1e',
                    );
                }
                bar.update(analyzer.progress);
            }
        },
    );
}

function verifyPredef(predefName)
{
    const verify =
    () =>
    {
        const PREDEF_TEST_DATA_MAP_OBJ = require('./predef-test-data');

        const { availableEntries, formatVariant, organizedEntries, replaceVariant } =
        PREDEF_TEST_DATA_MAP_OBJ[predefName];
        verifyDefinitions
        (organizedEntries, availableEntries, mismatchCallback, replaceVariant, formatVariant);
    };
    return verify;
}

function verifyStrategy(strategyTestData)
{
    const result =
    () =>
    {
        const { createInput, features, strategyName } = strategyTestData;
        const strategies = JScrewIt.debug.getStrategies();
        const strategy = strategies[strategyName];
        const minLength = strategy.MIN_INPUT_LENGTH;
        checkMinInputLength(features, createInput, strategies, strategy, minLength);
    };
    return result;
}

const verify = { __proto__: null };

JScrewIt.debug.getComplexNames().forEach
(
    complex =>
    {
        if (!verify[complex])
        {
            const entry = JScrewIt.debug.getComplexEntry(complex);
            verify[complex] =
            () =>
            {
                const ok = verifyComplex(complex, entry);
                if (ok)
                    logOk('Ok.');
                else
                    logWarn('Not useful.');
            };
        }
    },
);

verify['BASE64_ALPHABET_HI_4:0'] = verifyPredef('BASE64_ALPHABET_HI_4:0');

verify['BASE64_ALPHABET_HI_4:4'] = verifyPredef('BASE64_ALPHABET_HI_4:4');

verify['BASE64_ALPHABET_HI_4:5'] = verifyPredef('BASE64_ALPHABET_HI_4:5');

verify['BASE64_ALPHABET_LO_4:1'] = verifyPredef('BASE64_ALPHABET_LO_4:1');

verify['BASE64_ALPHABET_LO_4:3'] = verifyPredef('BASE64_ALPHABET_LO_4:3');

verify.FROM_CHAR_CODE = verifyPredef('FROM_CHAR_CODE');

verify.FROM_CHAR_CODE_CALLBACK_FORMATTER = verifyPredef('FROM_CHAR_CODE_CALLBACK_FORMATTER');

verify.MAPPER_FORMATTER = verifyPredef('MAPPER_FORMATTER');

verify.OPTIMAL_B = verifyPredef('OPTIMAL_B');

verify.OPTIMAL_RETURN_STRING = verifyPredef('OPTIMAL_RETURN_STRING');

{
    const STRATEGY_TEST_DATA_LIST = require('./strategy-test-data');

    for (const strategyTestData of STRATEGY_TEST_DATA_LIST)
        verify[strategyTestData.strategyName] = verifyStrategy(strategyTestData);
}

main();
