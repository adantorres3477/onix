from flask import Flask, render_template # type: ignore
from flask_mysqldb import MySQL
from config import config
onixApp = Flask(__name__)

onixApp.config.from_object(config['Development'])
db = MySQL(onixApp)
@onixApp.route("/")
def home():
    return render_template(home.html)
if __name__ == "__main__":
    onixApp.run(debug=True,port=5000)