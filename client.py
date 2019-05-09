import requests
import json
headers = {'content-type':'application/json'}
url="http://localhost:8888/"   #IP和端口号，注意register后要加/
data = {
    'taskId':"11",
    'shareDir':'sharedir',
    'url':'url',
    'name':'Name'
}
r = requests.post(url, data=json.dumps(data),headers=headers)
print(r.text)
