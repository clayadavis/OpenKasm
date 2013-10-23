# -*- coding: utf-8 -*-
# <nbformat>3.0</nbformat>

# <codecell>

import time
import requests

# <codecell>

EMAIL = "asgasg@dsga.com"

# <codecell>

while True:
    r = requests.post('http://maskr.me/welcome/create', {"email":EMAIL})
    if r.status_code == 200:
        break
    else:
        print "Request returned status code %i, retrying in 1s..." % r.status_code
        time.sleep(1)
        
print "%s@maskr.me" % r.json()['username']

# <codecell>

r.text

# <codecell>

r.json()

