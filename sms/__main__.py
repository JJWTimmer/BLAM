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

import logging

logfile = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'RVD-SMS-Daemon.log')
logging.basicConfig(filename=logfile, level=logging.INFO, format='%(asctime)s %(filename)s[%(lineno)d]: %(message)s')
logging.info('Logging initialized')


def load_configuration(config_file):
    """
    I read the configfile and populate the config dict
    """
    file = open(config_file)
    config = json.load(file)
    file.close()

    return config


if __name__ == "__main__":
    logging.info('Starting main')
    config = load_configuration(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'config.json'))
    logging.info('Config Loaded')
    pidfile = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'RVD-SMS-Daemon.pid')
    daemon = SMSDaemon(pidfile, config)
    logging.info('Daemon created')
    logging.info('Number of arguments %s', len(sys.argv))
    if len(sys.argv) == 2:
        if 'start' == sys.argv[1]:
            logging.info('Starting Daemon')
            daemon.start()
        elif 'stop' == sys.argv[1]:
            logging.info('Stopping Daemon')
            daemon.stop()
        elif 'restart' == sys.argv[1]:
            logging.info('restarting Daemon')
            daemon.restart()
        elif 'run' == sys.argv[1]:
            logging.info('Running Daemon without forking')
            daemon.run()
        else:
            logging.info('Unknown command: %s', sys.argv[1])
            print "Unknown command"
            sys.exit(2)
        sys.exit(0)
    else:
        logging.info('Incorrect number of arguments')
        print "usage: %s start|stop|restart|run" % sys.argv[0]
        sys.exit(2)