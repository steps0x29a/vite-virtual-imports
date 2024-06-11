import { existsSync, readFileSync } from 'node:fs';
import chalk from 'chalk';


// options.encoding
// options.log
// options.debug
const virtualImportPlugin = (options) => {
  
  const _log = (message) => {
    if(!!options?.log) {
      console.log(`[vite-virtual-import] ${message}`);
    }
  };

  const _debug = (message) => {
    if(!!options?.debug) {
      console.log(`[vite-virtual-import] ${message}`);
    }
  };


  /**
   * Attempts to resolve a virtual import to a real file (which is either the desired file or the fallback file)
   * @param {string} desired The path to the desired file to resolve
   * @param {string} fallback The path to the fallback file to resolve
   */
  const _resolveVirtualImport = (desired, fallback) => {
    try {
      if(existsSync(desired)) {
        _debug(`Resolved virtual import to desired file: ${desired}`);
        return readFileSync(desired, { encoding: options?.encoding || 'utf-8' });
      } else {
        _debug(`Resolved virtual import to fallback file: ${fallback}`);
        console.warn(`[vite-virtual-import] Desired file not found: ${chalk.yellow(desired)}. Using fallback file: ${fallback}'`);
        return readFileSync(fallback, { encoding: options?.encoding || 'utf-8' });
      }
    } catch(e) {
      console.error(e);
      return '';
    }
  };

  return {
    name: 'vite-virtual-imports',
    resolveId(id) {

      if(!options?.map) {
        return id;
      }

      const item = options.map.find((r) => {
        return r.virtual === id;
      });

      if(item) {
        _debug(`Virtual import '${id}' is recognized: ${item.resolved}`);
        return item.resolved;
      }
    },

    load(id) {
      

      if(!options?.map) {
        // console.warn('No virtual imports provided. Skipping load.');
        return id;
      }

      const item = options.map.find((r) => {
        return r.resolved === id;
      });

      if(item) {
        _debug(`Loading virtual import: ${id} (desired: ${item.file}, fallback: ${item.fallback})`);
        return _resolveVirtualImport(item.file, item.fallback);
      }
    }
  };
};

export default virtualImportPlugin;