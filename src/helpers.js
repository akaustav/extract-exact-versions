import fs from 'node:fs/promises';

export function createExactPackageObject(packageObj, lockedPackages, lockfileVersion) {
  const exactPackages = {};

  for (const packageName of packageObj) {
    let lockedPackage;

    if (lockfileVersion === 1) {
      lockedPackage = lockedPackages[packageName];
    } else {
      lockedPackage = lockedPackages[`node_modules/${packageName}`]
    }

    if (lockedPackage) {
      exactPackages[packageName] = lockedPackage.version;
    } else {
      console.err('Package:', packageName, 'does NOT exist in lock file');
    }
  }

  return exactPackages;
}

export async function writeJSONFile(content) {
  try {
    await fs.writeFile('output/package.output.json', content);
  } catch (err) {
    console.log(err);
  }
}
