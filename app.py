import os
import datetime
from flask import Flask, render_template, url_for, redirect, request, json, flash
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'docx'])


app = Flask(__name__)
app.config["MONGO_DBNAME"] = 'TrainerOneOneDB'
app.config["MONGO_URI"] = os.getenv('MONGO_URI', 'mongodb://localhost')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


mongo = PyMongo(app)

@app.route("/")
def home():
    return render_template("home.html", programs=mongo.db.TOOCollection.find())
    
@app.route("/workouts")
def workouts():
    return render_template("workouts.html")
    
@app.route("/excersises")
def excersises():
    return render_template("excersises.html")
    
@app.route("/add-program")
def add_program():
    return render_template("add-program.html")
    
def allowed_file(filename):
    return '.' in filename and \
          filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploads', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['eif']
        if file and allowed_file(file.filename):
            dateTimeNow = str(datetime.datetime.now())
            filename = secure_filename(request.form['exercise-name'] + '_' + dateTimeNow)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return render_template("add-program.html")


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"), 
    port=int(os.environ.get("PORT")), 
    debug=True)