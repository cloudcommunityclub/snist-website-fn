
# Rules
- task completion - proceed with next task, no permission required, just inform; unless its a deciding change 
- do not output: code changes,read, write, bash, edit  (to save tokens) 
- dont commit anything
- ask questions with options with taking big/breaking decisions 
- Report only failures 

## Git Rules:
### always allow commands: 
- show
- log
- diff
- commit
- add
- checkout

### ask permissions

## Test Rules:
- always allow to run all tests

## Terminal rules
### always allow
- grep
- npx eslint
- lint checks commands
- mkdir


## Output Suppression

Do not output:

* Read operations
* Edit operations
* Bash commands
* Command results
* Test logs
* Lint output
* Typecheck output
* File diffs
* Tool traces
* Subagent transcripts

Run them silently.

Only output:

* Current task status
* Blocking issues
* Important decisions requiring user input
* Final completion summary

For tests, lint, typecheck, and verification:

* Run automatically.
* Do not print logs.
* Report only failures with a concise error summary.
* If all checks pass, simply state: "Verification passed."

For file edits:

* Do not show diffs or edited code unless explicitly requested.

For command execution:

* Execute approved commands silently.
* Do not echo commands before or after execution.





# Project Rules

Before coding, read:
- docs/ai-memory/00-project-overview.md
- docs/ai-memory/01-architecture.md
- docs/ai-memory/04-current-state.md

After every feature update:
1. Update docs/ai-memory/02-features-log.md
2. Update docs/ai-memory/04-current-state.md
3. Add major decisions to docs/ai-memory/03-decisions.md
4. Mention changed files, new APIs, DB changes, and pending bugs

create files/folders inside docs if it dosent exists

