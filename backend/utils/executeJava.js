import fs from "fs/promises";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create temp directory
const tempDir = path.join(process.cwd(), 'temp');
try {
  await fs.mkdir(tempDir, { recursive: true });
} catch (error) {
  console.error('Error creating temp directory:', error);
}

export const executeJava = async (code, input) => {
  // Create a unique directory for this compilation
  const timestamp = Date.now();
  const dirPath = path.join(tempDir, `compile_${timestamp}`);
  await fs.mkdir(dirPath, { recursive: true });

  const codePath = path.join(dirPath, "Main.java");
  const inputPath = path.join(dirPath, "input.txt");
  const outputPath = path.join(dirPath, "output.txt");

  try {
    await fs.writeFile(codePath, code);
    await fs.writeFile(inputPath, input);

    // Compile the code
    const compileCommand = `javac ${codePath}`;
    await execAsync(compileCommand);

    // Run the code
    const runCommand = `cd ${dirPath} && java Main < ${inputPath} > ${outputPath}`;
    await execAsync(runCommand, { timeout: 5000 });

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
    // Clean up
    await fs.rm(dirPath, { recursive: true, force: true });
  }
};
