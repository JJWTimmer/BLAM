import json


class BataSMS(object):
    def __init__(self, msg):
        self.json = msg
        self.data = json.loads(msg)
        self.normalized = self.normalize()

    def normalize(self):
        msg = self.data['message_raw']
        msg = msg.replace(self.data['keyword'], '', 1).replace(self.data['subkeyword'], '', 1).strip()
        return msg
