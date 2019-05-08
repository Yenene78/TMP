from flask import Flask, request, make_response
from flask_cors import CORS

app = Flask(__name__);
CORS(app, resources=r'/*')

@app.route("/", methods=['POST'])
def hello_world():
	reqData = str(request.data).strip("b'");
	reqData = reqData.split("&");
	print(reqData);
	response=make_response("HelloWorld!");
	response.headers["Access-Control-Allow-Origin"] = "*";
	response.headers["Access-Control-Allow-Headers"] = "X-Requested-With,Content-Type";
	response.headers["Access-Control-Allow-Methods"] = "PUT,POST,GET,DELETE,OPTIONS";
	response.headers["Cache-Control"] = "no-cache";
	response.headers["contentType"] = "application/json; charset=utf-8";
	return(response);

if __name__ == "__main__":
	app.run(port=8888, debug=True);


