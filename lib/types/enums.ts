enum CODE_LANGUAGES {
    //     oneC (1c)
    // abnf
    // accesslog
    // actionscript
    // ada
    // angelscript
    // apache
    // applescript
    // arcade
    // arduino
    // armasm
    // asciidoc
    // aspectj
    // autohotkey
    // autoit
    // avrasm
    // awk
    // axapta
    BASH = 'bash',
    // basic
    // bnf
    // brainfuck
    // cLike (c-like)
    // c
    // cal
    // capnproto
    // ceylon
    // clean
    // clojureRepl (clojure-repl)
    // clojure
    // cmake
    // coffeescript
    // coq
    // cos
    // cpp
    // crmsh
    // crystal
    // csharp
    // csp
    // css
    // d
    // dart
    // delphi
    // diff
    // django
    // dns
    // dockerfile
    // dos
    // dsconfig
    // dts
    // dust
    // ebnf
    // elixir
    // elm
    // erb
    // erlangRepl (erlang-repl)
    // erlang
    // excel
    // fix
    // flix
    // fortran
    // fsharp
    // gams
    // gauss
    // gcode
    // gherkin
    // glsl
    // gml
    GO = 'go',
    // golo
    // gradle
    // groovy
    // haml
    // handlebars
    // haskell
    // haxe
    // hsp
    // htmlbars
    // http
    // hy
    // inform7
    // ini
    // irpf90
    // isbl
    JAVA = 'java',
    JAVASCRIPT = 'javascript',
    // jbossCli (jboss-cli)
    JSON = 'json',
    // juliaRepl (julia-repl)
    // julia
    // kotlin
    // lasso
    // latex
    // ldif
    // leaf
    // less
    // lisp
    // livecodeserver
    // livescript
    // llvm
    // lsl
    // lua
    // makefile
    // markdown
    // mathematica
    // matlab
    // maxima
    // mel
    // mercury
    // mipsasm
    // mizar
    // mojolicious
    // monkey
    // moonscript
    // n1ql
    // nginx
    // nim
    // nix
    // nodeRepl (node-repl)
    // nsis
    // objectivec
    // ocaml
    // openscad
    // oxygene
    // parser3
    // perl
    // pf
    // pgsql
    // phpTemplate (php-template)
    // php
    // plaintext
    // pony
    // powershell
    // processing
    // profile
    // prolog
    // properties
    // protobuf
    // puppet
    // purebasic
    // pythonRepl (python-repl)
    PYTHON = 'python',
    // q
    // qml
    // r
    // reasonml
    // rib
    // roboconf
    // routeros
    // rsl
    // ruby
    // ruleslanguage
    // rust
    // sas
    // scala
    // scheme
    // scilab
    // scss
    // shell
    // smali
    // smalltalk
    // sml
    // sqf
    // sql
    // sqlMore (sql_more)
    // stan
    // stata
    // step21
    // stylus
    // subunit
    // swift
    // taggerscript
    // tap
    // tcl
    // thrift
    // tp
    // twig
    TYPESCRIPT = 'typescript'
    // vala
    // vbnet
    // vbscriptHtml (vbscript-html)
    // vbscript
    // verilog
    // vhdl
    // vim
    // x86asm
    // xl
    // xml
    // xquery
    // yaml
    // zephir
}

enum ENERGY {
    ACOUSTIC_WOOD = 'acoustic-wood',
    CIPHER_VAULT = 'cipher-vault',
    CREMA_EXTRACTION = 'crema-extraction',
    DAWN_CHORUS = 'dawn-chorus',
    DUSK_BLOOM = 'dusk-bloom',
    EVENT_HORIZON = 'event-horizon',
    MAKERS_CANVAS = 'makers-canvas',
    NEON_SYMPHONY = 'neon-symphony',
    TROPICAL_GRID = 'tropical-grid',
    ZEN_TOOLKIT = 'zen-toolkit'
}

enum HTTP_STATUS_CODE {
    SUCCESS = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}

enum THEME {
    AMBER = 'light',
    GUN_METAL = 'dark'
}

enum UI_STATE {
    'LOADING',
    'ERROR',
    'SUCCESS',
    'IDLE'
}

export { CODE_LANGUAGES, ENERGY, HTTP_STATUS_CODE, THEME, UI_STATE };
