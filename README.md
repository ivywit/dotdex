# DotDex

DotDex is a simple manager for your dot files. Really any files can be tracked, but this software's intent was dot files.

## Installation

```bash
$ npm install -g dotdex
```

## Usage

The main aspect of this gem is the dotdex executable, run as follows:
```
Usage:

        dotdex <command> [attribute] [path]

Commands:
        init -- create new dotdex
        list -- list watched files
        update <program> <path> -- update attribute with new path
        drop <program> -- remove dot file from dotdex
        push -- push local dot files to repo
        pull -- pull remote dot files from repo

```

## Development

After checking out the repo, run `npm install` to install dependencies.  

To install this module onto your local machine, run `npm link`.  

To release a new version, update the version number in `package.json`, and then run `npm publish`, which will publish the update to [npm](https://npmjs.org). (proper permission required for publishing)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/ivy4vera/dotdex. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](https://www.contributor-covenant.org/version/1/4/code-of-conduct) code of conduct.


## License

The module is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

