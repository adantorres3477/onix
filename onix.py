from flask import Flask, render_template, request, redirect, url_for
from flask_mysqldb import MySQL
from flask_login import LoginManager , login_user, login_required, current_user
from config import config
from werkzeug.security import generate_password_hash

onixApp = Flask(__name__)
onixApp.config.from_object(config['Development'])
db = MySQL(onixApp)


@onixApp.route("/")
def home():
    
    return render_template('/home.html')

@onixApp.route('/signup', methods=['GET', 'POST'])
def signup():
        if request.method == 'POST':
            nombre = request.form['nombre']
            correo = request.form['correo']
            clave = request.form['clave']
            claveCifrada = generate_password_hash(clave)
            regUsuario = db.connection.cursor()
            regUsuario.execute("INSERT INTO usuario (nombre, correo, clave) VALUES (%s,%s,%s)", (nombre, correo, claveCifrada))
            db.connection.commit()
            regUsuario.close()
            return redirect(url_for('home'))
            
        
            return render_template('home.html')
        else :
            return render_template('home.html')

@onixApp.route('/signout',methods=['GET','POST'])
def signout();
    logout_user()
    return redirect(url_for('home'))

@onixApp.route('/home_admin',methods=['GET', 'POST'])
def home_admin():
    return render_template('admin.html')

@onixApp.route('/home_admin',methods=['GET', 'POST'])
def home_user():
    return render_template('user.html')


















if __name__ == "__main__":
    onixApp.run(port=5050, debug=True)