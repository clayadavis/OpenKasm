import json
import random
import string

from flask import Flask, request, jsonify, render_template
from flask.ext.pymongo import PyMongo
from pymongo.errors import DuplicateKeyError
app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'kasm'
mongo = PyMongo(app)

@app.route('/')
def hello_world():
    return render_template('kasm.html')


@app.route('/create', methods=['POST'])
def create():
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


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
