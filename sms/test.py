#!/usr/bin/env python
import json

import pika


def load_configuration(config_file):
    '''
    I read the configfile and populate the config dict
    '''
    file = open(config_file)
    config = json.load(file)
    file.close()

    return config


config = load_configuration('config.json')

credentials = pika.PlainCredentials(config['queue_username'], config['queue_password'])
parameters = pika.ConnectionParameters(config['queue_server'], config['queue_port'], '/', credentials)
connection = pika.BlockingConnection(parameters)
channel = connection.channel()
channel.queue_declare(queue=config['queue_name'], durable=True)

channel.basic_publish(exchange='',
                      routing_key=config['queue_name'],
                      body="""{
    "message_id"    : "23f324v2v23asdf99fdas",
    "shortcode"     : "1008",
    "keyword"       : "bata",
    "subkeyword"    : "mk",
    "sender"        : "+31612345678",
    "sender_name"   : "Jan Batavier indien bekend, anders null",
    "message_raw"   : "bata mk raw message",
    "received"      : "2013-04-16 18:45:23"
}""")
print " [x] Sent sms"
connection.close()