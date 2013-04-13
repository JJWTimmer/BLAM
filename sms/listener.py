import pika
import logging

from daemon import Daemon
from sms import BataSMS
from blam import Blam


class SMSDaemon(Daemon):
    def __init__(self, pidfile, config):
        logging.info('Initializing SMSDaemon')
        super(SMSDaemon, self).__init__(pidfile)
        logging.info('SMSDaemon initilized parent')
        self.config = config

    def run(self):
        logging.info('SMSDaemon start running')
        credentials = pika.PlainCredentials(str(self.config['queue_username']), str(self.config['queue_password']))
        parameters = pika.ConnectionParameters(str(self.config['queue_server']), self.config['queue_port'], '/', credentials)
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        channel.queue_declare(queue=str(self.config['queue_name']), durable=True)

        def callback(ch, method, properties, body):
            logging.info('SMSDaemon callback')
            sms = BataSMS(body)
            blam = Blam(self.config['blam_host'], self.config['blam_port'], self.config['blam_user'],
                        self.config['blam_password'], self.config['blam_database'])
            blam.add_sms(sms)

        channel.basic_consume(callback, queue=self.config['queue_name'], no_ack=True)
        logging.info('SMSDaemon start consuming')
        channel.start_consuming()