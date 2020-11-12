rebuild
=======

rebuild everything

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/rebuild.svg)](https://npmjs.org/package/rebuild)
[![Downloads/week](https://img.shields.io/npm/dw/rebuild.svg)](https://npmjs.org/package/rebuild)
[![License](https://img.shields.io/npm/l/rebuild.svg)](https://github.com/youyiqin/rebuild/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g rebuild
$ rebuild COMMAND
running command...
$ rebuild (-v|--version|version)
rebuild/0.0.0 darwin-x64 node-v13.13.0
$ rebuild --help [COMMAND]
USAGE
  $ rebuild COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`rebuild hello [FILE]`](#rebuild-hello-file)
* [`rebuild help [COMMAND]`](#rebuild-help-command)

## `rebuild hello [FILE]`

describe the command here

```
USAGE
  $ rebuild hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ rebuild hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/youyiqin/rebuild/blob/v0.0.0/src/commands/hello.ts)_

## `rebuild help [COMMAND]`

display help for rebuild

```
USAGE
  $ rebuild help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_
<!-- commandsstop -->
