import sys
import modal

CommandR = modal.Cls.from_name("command-r-transformers", "CommandR")

messages = [{"role": "user", "content": "Which laws protect me against hacking in Tunisia?"}]

for token in CommandR().generate.remote_gen(messages):
    print(token, end="", flush=True)
print()
