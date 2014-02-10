import logging
from lamson.routing import route, route_like, stateless
from config.settings import relay, db, hostnames
from lamson import view

@route("(address)@(host)", address=".+")
def START(message, address=None, host=None):
    if host.lower().strip() not in hostnames:
        #May be unnecessary due to settings.hosts
        return WRONGHOST

    cur = db.redirects.find_one({'alias': address})
    if cur is None or cur.get('email') is None or cur.get('deactivated'):
        return NOTFOUND
    else:
        message['Subject'] = '[kasm:{}] {}'.format(address, message['Subject'])
        message['To'] = cur['email']
        return FORWARD(message, address, host)


@route_like(START)
def WRONGHOST(message, address=None, host=None):
    logging.error('WRONGHOST: received mail with host "%s".' % host)
    return ERROR


@route_like(START)
def NOTFOUND(message, address=None, host=None):
    logging.error('NOTFOUND: received mail with alias "%s", not found.' % address)
    return ERROR #(message, address, host)


@route_like(START)
@stateless
def FORWARD(message, address=None, host=None):
    relay.deliver(message)


@route_like(START)
@stateless
def ERROR(message, address=None, host=None):
    pass
