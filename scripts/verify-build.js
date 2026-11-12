const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');

// FAQ redirect mappings
const faqMappings = [
  { num: '1', slug: 'image-pull' },
  { num: '2', slug: 'wsl-docker' },
  { num: '3', slug: 'run-mode-apiserver' },
  { num: '6', slug: 'windows-vmp' },
  { num: '7', slug: 'linux-dns' },
];

const locales = [
  { prefix: '', name: 'English' },
  { prefix: '/zh', name: 'Chinese' },
];

let allPassed = true;

function checkExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} exists: ${filePath}`);
    return true;
  } else {
    console.error(`❌ ${description} missing: ${filePath}`);
    allPassed = false;
    return false;
  }
}

function checkRedirect(filePath, expectedTarget) {
  if (!checkExists(filePath, `Redirect file for ${expectedTarget}`)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const hasRefresh = content.includes(`url=${expectedTarget}`);
  const hasCanonical = content.includes(`href="${expectedTarget}"`);
  const hasScript = content.includes(`window.location.href = '${expectedTarget}'`);
  if (hasRefresh && hasCanonical && hasScript) {
    console.log(`✅ Redirect correctly points to ${expectedTarget}`);
  } else {
    console.error(`❌ Redirect does not point to ${expectedTarget}`);
    allPassed = false;
  }
}

function checkEditUrl(filePath, expectedUrlPart, description) {
  if (!checkExists(filePath, description)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(expectedUrlPart)) {
    console.log(`✅ ${description} has correct edit URL: ${expectedUrlPart}`);
  } else {
    console.error(`❌ ${description} missing correct edit URL: ${expectedUrlPart}`);
    allPassed = false;
  }
}

// Run checks
console.log('🔍 Starting build verification...\n');

// Check new FAQ pages exist
locales.forEach(({ prefix, name }) => {
  faqMappings.forEach(({ slug }) => {
    const docPath = path.join(buildDir, prefix, 'docs', 'faq', slug, 'index.html');
    checkExists(docPath, `${name} FAQ page /docs/faq/${slug}`);
  });
});

console.log();

// Check all redirects exist and point correctly
locales.forEach(({ prefix, name }) => {
  faqMappings.forEach(({ num, slug }) => {
    const expectedTarget = `${prefix}/docs/faq/${slug}`;
    // Check /faq/N redirect
    const redirectPath1 = path.join(buildDir, prefix, 'faq', num, 'index.html');
    checkRedirect(redirectPath1, expectedTarget);
    // Check /docs/faq/N redirect
    const redirectPath2 = path.join(buildDir, prefix, 'docs', 'faq', num, 'index.html');
    checkRedirect(redirectPath2, expectedTarget);
  });
});

console.log();

// Check edit URLs in quickstart
checkEditUrl(
  path.join(buildDir, 'docs', 'quickstart', 'index.html'),
  'edit/master/docs/quickstart.md',
  'English quickstart'
);
checkEditUrl(
  path.join(buildDir, 'zh', 'docs', 'quickstart', 'index.html'),
  'edit/master/i18n/zh/docusaurus-plugin-content-docs/current/quickstart.md',
  'Chinese quickstart'
);

console.log();

if (allPassed) {
  console.log('🎉 All verification checks passed!');
  process.exit(0);
} else {
  console.error('❌ Some verification checks failed!');
  process.exit(1);
}
