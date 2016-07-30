# Minfies takeout files somehow

import json;
import sys;

def main():
    original = sys.argv[1];
    output = sys.argv[2];
    archive = json.loads(open(original, "r").read());
    open(output, "w").write(json.dumps(archive));

main();
