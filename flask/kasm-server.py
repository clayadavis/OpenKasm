import json
import random

from flask import Flask, request, jsonify
from flask.ext.pymongo import PyMongo
from pymongo.errors import DuplicateKeyError
app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'kasm'
mongo = PyMongo(app)

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/create', methods=['POST'])
def create():
    def id_generator(size, chars=string.ascii_lowercase + string.digits):
        return ''.join(random.choice(chars) for _ in xrange(size))
    post_data = json.loads(request.data)
    email = post_data['email']
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


if __name__ == '__main__':
    app.run()
