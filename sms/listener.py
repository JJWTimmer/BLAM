import pika

from daemon import Daemon
from sms import BataSMS
from blam import Blam


class SMSDaemon(Daemon):
    def __init__(self, pidfile, config):
        super(SMSDaemon, self).__init__(self, pidfile)
        self.config = config

    def run(self):
        credentials = pika.PlainCredentials(self.config['queue_username'], self.config['queue_password'])
        parameters = pika.ConnectionParameters(self.config['queue_server'], self.config['queue_port'], '/', credentials)
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        channel.queue_declare(queue=self.config['queue_name'], durable=True)

        def callback(ch, method, properties, body):
            sms = BataSMS(body)
            blam = Blam(self.config['blam_host'], self.config['blam_port'], self.config['blam_user'],
                        self.config['blam_password'], self.config['blam_database'])
            blam.add_sms(sms)

        channel.basic_consume(callback, queue=self.config['queue_name'], no_ack=True)
        channel.start_consuming()