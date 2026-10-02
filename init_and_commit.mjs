import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const dir = process.cwd();

async function initAndCommit() {
  console.log('Initializing git repository in', dir);
  await git.init({ fs, dir, defaultBranch: 'main' });

  // Read files to add (excluding node_modules, .next, etc.)
  function getAllFiles(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(dir, fullPath).replace(/\\/g, '/');

      if (
        relPath === 'node_modules' ||
        relPath.startsWith('node_modules/') ||
        relPath === '.next' ||
        relPath.startsWith('.next/') ||
        relPath === '.git' ||
        relPath.startsWith('.git/') ||
        relPath.endsWith('.db') ||
        relPath.endsWith('.db-journal')
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        files = files.concat(getAllFiles(fullPath));
      } else {
        files.push(relPath);
      }
    }
    return files;
  }

  const filesToAdd = getAllFiles(dir);
  console.log(`Staging ${filesToAdd.length} files...`);

  for (const filepath of filesToAdd) {
    await git.add({ fs, dir, filepath });
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Nova Cart Engineering',
      email: 'engineering@novacart.in',
    },
    message: 'feat: NOVA CART — Local Commerce Intelligence production application',
  });

  console.log('✅ Initial commit created successfully! Commit SHA:', sha);
}

initAndCommit().catch(console.error);
