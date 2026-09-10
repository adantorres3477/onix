from flask_mysqldb import MySQL
from config import config

onixApp.config.from_object(config['Development'])
db = MySQL(onixApp)
