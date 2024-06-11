const buildReplacement = (virtualImport, desiredPath, fallbackPath) => {
  return {
    virtual: virtualImport,
    resolved: '\0' + virtualImport,
    file: desiredPath,
    fallback: fallbackPath
  }
};

export default buildReplacement;