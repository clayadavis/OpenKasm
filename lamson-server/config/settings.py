# This file contains python variables that configure Lamson for email processing.
import logging
import pymongo

hostnames = ['kasm.clayadavis.net', 'openkasm.com', 'remixmail.com']
# You may add additional parameters such as `username' and `password' if your
# relay server requires authentication, `starttls' (boolean) or `ssl' (boolean)
# for secure connections.
relay_config = {'host': 'localhost', 'port': 8825}

#receiver_config = {'host': 'localhost', 'port': 8823}
#receiver_config = {'host': 'localhost', 'port': 25}
receiver_config = {'host': '0.0.0.0', 'port': 25}

handlers = ['app.handlers.kasm']

#router_defaults = {'host': '.+'}
hosts = ['localhost', '127.0.0.1'] + hostnames

router_defaults = {'host': '|'.join(['(%s)' % x for x in hosts])}

template_config = {'dir': 'app', 'module': 'templates'}

# the config/boot.py will turn these values into variables set in settings

db_client = pymongo.MongoClient()
db = db_client.kasm
