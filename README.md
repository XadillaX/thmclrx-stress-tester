# ThmclrX Stress Tester

## Usage

```sh
Usage: ./run.js <action> [options]

action     tester action. [gen|test]

Options:
   -t, --type    type number in http://m.lovebizhi.com/.  [7]
   -p, --pages   example: 1,3,5-9,12  [1-5]
```

### Examples

```sh
$ ./run.js gen -t 7 -p 1,3,5-9.12
$ ./run.js gen
$ ./run.js test
```

