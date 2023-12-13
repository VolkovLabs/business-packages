/**
 * Global variables
 */
export const GLOBAL_VARIABLES = [
  '__time',
  '__timeEpoch',
  '__timeFilter',
  '__timeFrom',
  '__timeTo',
  '__timeGroup',
  '__timeGroupAlias',
  '__unixEpochFilter',
  '__unixEpochNanoFilter',
  '__unixEpochNanoFrom',
  '__unixEpochNanoTo',
  '__unixEpochGroup',
  '__unixEpochGroupAlias',
];

/*
 * This regex matches 3 types of variable reference with an optional format specifier
 * There are 6 capture groups that replace will return
 * \$(\w+)                                    $var1
 * \[\[(\w+?)(?::(\w+))?\]\]                  [[var2]] or [[var2:fmt2]]
 * \${(\w+)(?:\.([^:^\}]+))?(?::([^\}]+))?}   ${var3} or ${var3.fieldPath} or ${var3:fmt3} (or ${var3.fieldPath:fmt3} but that is not a separate capture group)
 */
export const VARIABLE_REGEX = /\$(\w+)|\[\[(\w+?)(?::(\w+))?\]\]|\${(\w+)(?:\.([^:^\}]+))?(?::([^\}]+))?}/g;
