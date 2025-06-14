// oj-backend/utils/executeCpp.js
import fs from "fs/promises";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from 'util';
import crypto from 'crypto';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create temp directory
const tempDir = path.join(process.cwd(), 'temp');
const cacheDir = path.join(process.cwd(), 'cache');
try {
  await fs.mkdir(tempDir, { recursive: true });
  await fs.mkdir(cacheDir, { recursive: true });
} catch (error) {
  console.error('Error creating directories:', error);
}

// Simple in-memory cache for compiled executables
const compilationCache = new Map();

export const executeCpp = async (code, input) => {
  // Create a unique directory for this execution
  const timestamp = Date.now();
  const dirPath = path.join(tempDir, `compile_${timestamp}`);
  await fs.mkdir(dirPath, { recursive: true });

  const codePath = path.join(dirPath, "code.cpp");
  const inputPath = path.join(dirPath, "input.txt");
  const outputPath = path.join(dirPath, "output.txt");
  const executablePath = path.join(dirPath, "code.out");

  try {
    // Generate hash of the code for caching
    const codeHash = crypto.createHash('md5').update(code).digest('hex');
    const cachedExecutable = compilationCache.get(codeHash);

    // Write input file
    await fs.writeFile(inputPath, input);

    if (cachedExecutable) {
      // Use cached executable
      await fs.copyFile(cachedExecutable, executablePath);
    } else {
      // Write and compile code
      await fs.writeFile(codePath, code);
      const compileCommand = `g++ -O2 -std=c++17 -Wall -Wextra -Werror ${codePath} -o ${executablePath}`;
      await execAsync(compileCommand);
      
      // Cache the compiled executable
      compilationCache.set(codeHash, executablePath);
    }

    // Run the code with a shorter timeout
    const runCommand = `${executablePath} < ${inputPath} > ${outputPath}`;
    await execAsync(runCommand, { timeout: 1000 }); // 1 second timeout

    // Read the output
    const output = await fs.readFile(outputPath, 'utf8');
    return output;
  } catch (error) {
    if (error.killed) {
      throw { error: "Time Limit Exceeded" };
    }
    if (error.stderr) {
      throw { error: "Compilation Error: " + error.stderr };
    }
    throw { error: "Runtime Error: " + error.message };
  } finally {
    // Clean up in the background
    fs.rm(dirPath, { recursive: true, force: true }).catch(console.error);
  }
};
