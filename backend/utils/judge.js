import { executeCpp } from './executeCpp.js';
import { executePython } from './executePython.js';
import { executeJava } from './executeJava.js';
import fs from 'fs/promises';
import path from 'path';

const VERDICT = {
    ACCEPTED: 'Accepted',
    WRONG_ANSWER: 'Wrong Answer',
    TIME_LIMIT_EXCEEDED: 'Time Limit Exceeded',
    COMPILATION_ERROR: 'Compilation Error',
    RUNTIME_ERROR: 'Runtime Error'
};

const compareOutputs = (expected, actual) => {
    // Normalize both outputs (remove trailing spaces, newlines, and convert to string)
    const normalizeOutput = (output) => {
        if (output === undefined || output === null) return '';
        return output.toString()
                    .replace(/\r\n/g, '\n')  // Convert Windows line endings
                    .replace(/\r/g, '\n')     // Convert old Mac line endings
                    .trim()
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .join('\n');
    };
    
    const normalizedExpected = normalizeOutput(expected);
    const normalizedActual = normalizeOutput(actual);
    
    return normalizedExpected === normalizedActual;
};

const executeCode = async (language, code, input) => {
    try {
        let output;
        switch (language) {
            case 'cpp':
                output = await executeCpp(code, input);
                break;
            case 'python':
                output = await executePython(code, input);
                break;
            case 'java':
                output = await executeJava(code, input);
                break;
            default:
                throw new Error('Unsupported language');
        }
        
        return { success: true, output };
    } catch (error) {
        console.error('Execution error:', error);
        // Handle storage service errors
        if (error.message && error.message.includes('Storage service not initialized')) {
            return { 
                success: false, 
                verdict: VERDICT.RUNTIME_ERROR, 
                error: "Server configuration error. Please try again or contact support."
            };
        }
        // If the error is a string, it's likely a direct error message
        if (typeof error === 'string') {
            return { success: false, verdict: error };
        }
        // If it's an object with an error property
        if (error.error) {
            if (error.error.includes('Time Limit Exceeded')) {
                return { success: false, verdict: VERDICT.TIME_LIMIT_EXCEEDED };
            }
            if (error.error.includes('Compilation Error:')) {
                return { success: false, verdict: VERDICT.COMPILATION_ERROR, error: error.error };
            }
            if (error.error.includes('Runtime Error:')) {
                return { success: false, verdict: VERDICT.RUNTIME_ERROR, error: error.error };
            }
            // If it's a wrong answer
            if (error.error === 'Wrong Answer') {
                return { success: false, verdict: VERDICT.WRONG_ANSWER };
            }
            // For any other error, return it as is
            return { success: false, verdict: error.error };
        }
        // For unknown errors
        return { success: false, verdict: VERDICT.RUNTIME_ERROR, error: "Unknown error: " + error.message };
    }
};

export const judge = async (code, language, testCases) => {
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const result = await executeCode(language, code, testCase.input);
        
        if (!result.success) {
            return {
                verdict: result.verdict,
                failedTestCase: i + 1,
                error: result.error
            };
        }

        if (!compareOutputs(testCase.output, result.output)) {
            return {
                verdict: VERDICT.WRONG_ANSWER,
                failedTestCase: i + 1,
                expected: testCase.output,
                got: result.output
            };
        }
    }

    return {
        verdict: VERDICT.ACCEPTED
    };
}; 