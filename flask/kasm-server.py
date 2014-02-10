import json
import random
import string

from flask import Flask, request, jsonify
from flask.ext.pymongo import PyMongo
from pymongo.errors import DuplicateKeyError

from crossdomain import crossdomain

app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'kasm'
mongo = PyMongo(app)

@app.route('/')
def hello_world():
    return "API is a go"


@app.route('/alias/create', methods=['POST'])
@crossdomain(origin='http://openkasm.com:8000')
def create_alias():
    def id_generator(size, chars=string.ascii_lowercase + string.digits):
        return ''.join(random.choice(chars) for _ in xrange(size))
    #post_data = json.loads(request.data)
    #email = post_data['email']
    email = request.form['email']
    inserted = False
    while not inserted:
        try:
            alias = id_generator(8)
            mongo.db.redirects.insert({'email': email, 'alias': alias})
        except DuplicateKeyError:
            pass
        else:
            inserted = True

    to_return = {'email': email,
                 'encrypt': 'lolwut',
                 'original': email,
                 'response': 'success',
                 'username': alias,
                 }
    return jsonify(to_return)


@app.route('/alias/deactivate', methods=['POST'])
@crossdomain(origin=['localhost', 'localhost:8000'])
def deactivate_alias():
    post_data = json.loads(request.data)
    alias = post_data['alias']
    result = mongo.db.redirects.update({'alias': alias},
                                       {'$set': {'deactivated': True}})
    to_return = {'alias': alias}
    to_return['response'] = 'success' if result['n'] > 0 else 'fail'
    return jsonify(to_return)


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
