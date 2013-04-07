import MySQLdb


class Blam(object):
    def __init__(self, host, port, user, pw, dbname):
        self.host = host
        self.port = port
        self.user = user
        self.pw = pw
        self.dbname = dbname
        self.conn = False

    def __del__(self):
        if self.conn:
            try:
                self.conn.close()
            except:
                pass

    def add_sms(self, sms):
        cur = False
        try:
            if self.pw:
                self.conn = MySQLdb.connect(host=self.host, port=self.port, user=self.user, passwd=self.pw,
                                            db=self.dbname)
            else:
                self.conn = MySQLdb.connect(host=self.host, port=self.port, user=self.user, db=self.dbname)
            cur = self.conn.cursor()
            vals = (sms.data['sender'], sms.data['sender_name'], sms.data['received'], sms.normalized)
            cur.execute("""INSERT INTO sms (sender_nr, sender_name, received_at, message) VALUES (%s, %s, %s, %s)""",
                        vals)
            self.conn.commit()

        except MySQLdb.Error, e:
            raise Exception("DB error: <%s>" % e)
        finally:
            if cur:
                cur.close()
            if self.conn:
                self.conn.close()