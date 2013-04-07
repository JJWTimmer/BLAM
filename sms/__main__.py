#!/usr/bin/env python
try:
    import pydevd

    pydevd.settrace('localhost', port=6666, stdoutToServer=True, stderrToServer=True)
except:
    pass

import sys
import json
import os
from listener import SMSDaemon


def load_configuration(config_file):
    """
    I read the configfile and populate the config dict
    """
    file = open(config_file)
    config = json.load(file)
    file.close()

    return config


if __name__ == "__main__":
    config = load_configuration(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'config.json'))
    daemon = SMSDaemon('/tmp/daemon-example.pid', config)
    if len(sys.argv) == 2:
        if 'start' == sys.argv[1]:
            daemon.start()
        elif 'stop' == sys.argv[1]:
            daemon.stop()
        elif 'restart' == sys.argv[1]:
            daemon.restart()
        elif 'run' == sys.argv[1]:
            daemon.run()
        else:
            print "Unknown command"
            sys.exit(2)
        sys.exit(0)
    else:
        print "usage: %s start|stop|restart|run" % sys.argv[0]
        sys.exit(2)