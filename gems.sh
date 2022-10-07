#!/bin/bash
set -x
redis-cli --raw json.arrappend gems $.$1 "{\"name\":\"$2\",\"players\":[]}"
