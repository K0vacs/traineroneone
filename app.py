import os
from flask import Flask, render_template, url_for, redirect, request, json, send_from_directory
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename


app = Flask(__name__)
app.config["MONGO_DBNAME"] = 'TrainerOneOneDB'
app.config["MONGO_URI"] = os.getenv('MONGO_URI', 'mongodb://localhost')
UPLOAD_FOLDER = 'uploads/'


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
    
@app.route("/test", methods=['POST'])
def test():
    if request.method == 'POST':
        file = request.files['eif']
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], 'filename'))
        return 'file uploaded successfully'
    
    
    # if request.method == 'POST':
    #     result = mongo.db.TOOCollection.insert_one({'exercise': request.form})
    #     return str(result.inserted_id)
    
    
    
    
    #if 'eif' in request.files:    
        #the_image = request.files['eif']
        #mongo.save_file(the_image.filename, the_image)
     #   return 'file uploaded successfully'


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"), 
    port=int(os.environ.get("PORT")), 
    debug=True)