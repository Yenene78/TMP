from flask import Flask, request, make_response
from flask_cors import CORS
<<<<<<< HEAD
from urllib import parse
=======
>>>>>>> b9b98141726192ff5a243e9acb05fa041dafa42d

app = Flask(__name__);
CORS(app, resources=r'/*')

@app.route("/", methods=['POST'])
def hello_world():
	reqData = str(request.data).strip("b'");
	reqData = reqData.split("&");
<<<<<<< HEAD
	dic = {};
	for x in reqData:
		x = parse.unquote(x);
		x = x.split("=");
		if(x[0] == "input"):
			dic["input"] = x[1];
		elif(x[0] == "output"):
			dic["output"] = x[1];
		else:
			dic["link"] = x[1];
	print(dic);
=======
	print(reqData);
>>>>>>> b9b98141726192ff5a243e9acb05fa041dafa42d
	response=make_response("HelloWorld!");
	response.headers["Access-Control-Allow-Origin"] = "*";
	response.headers["Access-Control-Allow-Headers"] = "X-Requested-With,Content-Type";
	response.headers["Access-Control-Allow-Methods"] = "PUT,POST,GET,DELETE,OPTIONS";
	response.headers["Cache-Control"] = "no-cache";
	response.headers["contentType"] = "application/json; charset=utf-8";
	return(response);

if __name__ == "__main__":
	app.run(port=8888, debug=True);


