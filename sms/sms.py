import json


class SMS(object):
    def __init__(self, msg):
        self.msg = msg


class BataSMS(SMS):
    def __init__(self, msg):
        self.json = msg
        self.data = json.loads(msg)
        super(BataSMS, self).__init__(self.normalize())

    def normalize(self):
        msg = self.data['message_raw']
        msg = msg.replace(self.data['keyword'], '', 1).replace(self.data['subkeyword'], '', 1).strip()
        return msg
