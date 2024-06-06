import packageConfig from '../input/package.json' with { type: 'json' };
import packageLockConfig from '../input/package-lock.json' with { type: 'json' };
import { createExactPackageObject, writeJSONFile } from './helpers.js';

const { dependencies, devDependencies } = packageConfig;
const { lockfileVersion = 1 } = packageLockConfig;

let lockedPackages = {};

if (lockfileVersion === 1) {
  ({ dependencies: lockedPackages } = packageLockConfig);
} else {
  ({ packages: lockedPackages } = packageLockConfig);
}

try {
  const prodPackages = Object.keys(dependencies);
  const exactProdPackages = createExactPackageObject(prodPackages, lockedPackages, lockfileVersion);

  packageConfig.dependencies = exactProdPackages;
} catch (error) {
  if (dependencies == null) {
    console.error('No `dependencies` found in input package.json');
  }
}

try {
  const devPackages = Object.keys(devDependencies);
  const exactDevPackages = createExactPackageObject(devPackages, lockedPackages, lockfileVersion);

  packageConfig.devDependencies = exactDevPackages;
} catch (error) {
  console.error(error);
  if (devDependencies == null) {
    console.error('No `devDependencies` found in input package.json');
  }
}

const packageConfigJSON = JSON.stringify(packageConfig, null, 2);

writeJSONFile(packageConfigJSON);

console.log('done');
