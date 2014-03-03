import pymongo as pm

client = pm.MongoClient()
db = client.kasm
redirects = db.redirects

## list(redirects.find())
