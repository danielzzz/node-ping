# Contributing

We welcome patches and features. There are however a few things that are
required before your pull request can be merged.

# Tests

## How to write a new test case

As output from system ping varied on languages and OS, our parser may fail
on new languages or OS. To improve the correctness and coverage for this
module, we need to gather output from those system pings.

### Upload a fixture about system ping

Suppose you are using `macos` in language `en`, you have a problem for running
our module. Please upload a capture of your system ping in folder
`test/fixture/$OS/$LANGUAGE`. In this case, the name of folder will be
`test/fixture/macos/en`

### Write expected answer in answer.json

NOTE: we recommend to use [this online editor][1] for editing the content for
`answer.json`

To verify the correctness of our module on your new fixture, please provide
the expected answer in `test/fixture/answer.json`.

Format of the key name is `$OS_$LANGUAGE_$FILENAME`. In our case, this is
`macos_en_sample1`.

Value of that key should be the result from our command.

```
{
    "host": "google.com",
    "numeric_host": "172.217.24.46",
    "alive": true,
    "output": "PING google.com (172.217.24.46): 56 data bytes\n64 bytes from 172.217.24.46: icmp_seq=0 ttl=54 time=5.371 ms\n64 bytes from 172.217.24.46: icmp_seq=1 ttl=54 time=4.269 ms\n64 bytes from 172.217.24.46: icmp_seq=2 ttl=54 time=4.970 ms\n64 bytes from 172.217.24.46: icmp_seq=3 ttl=54 time=5.228 ms\n\n--- google.com ping statistics ---\n4 packets transmitted, 4 packets received, 0.0% packet loss\nround-trip min/avg/max/stddev = 4.269/4.960/5.371/0.424 ms\n",
    "time": 5.371,
    "min": 4.269,
    "max": 4.96,
    "avg": 5.371,
    "stddev": 0.424
}
```

## Running test cases

We trust tesed codes. Please run below command for testing before sending
a pull request

```
$ grunt test
```

[1]: http://www.jsoneditoronline.org/
