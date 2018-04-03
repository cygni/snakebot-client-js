#!/usr/bin/env node --experimental-modules
/* eslint-env node */
import commander from 'commander';
import pkg from '../package.json';
import { createNodeClient } from '../index.mjs';

const { host, venue } = commander
  .name(pkg.name)
  .version(pkg.version)
  .option('-h, --host [url]', 'Host', 'snake.cygni.se')
  .option('-v, --venue [name]', 'Venue', 'training')
  .parse(process.argv);

createNodeClient({ host, venue });
