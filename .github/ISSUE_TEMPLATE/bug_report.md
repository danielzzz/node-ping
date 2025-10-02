---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description

A clear and concise description of what the bug is.

## Expected Behavior

A clear and concise description of what you expected to happen.

## Actual Behavior

A clear and concise description of what actually happened.

## Code Sample

If applicable, add a minimal code sample that reproduces the issue:

```javascript
const ping = require('ping');

ping.sys.probe('google.com', function(isAlive) {
    console.log(isAlive);
});
```

## Environment

- **OS**: [e.g. Windows 10, Ubuntu 20.04, macOS 12.0]
- **Node.js version**: [e.g. 18.17.0]
- **Package version**: [e.g. 0.4.4]
- **Platform**: [e.g. linux, win32, darwin] The output from nodejs `os.platform()`

## Error Output

If applicable, add error messages or stack traces:

```
Error: Platform |freebsd| is not support
    at Object.factory.createParser (/path/to/file.js:42:15)
    ...
```

## Raw system ping output

Please paste your raw system ping that causing your issue below

```
RAW OUTPUT Ping example HERE
```
