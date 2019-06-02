import os
from flask import Flask, render_template, url_for, redirect, request, json
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)
app.config["MONGO_DBNAME"] = 'TrainerOneOneDB'
app.config["MONGO_URI"] = os.getenv('MONGO_URI', 'mongodb://localhost')

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
        varss = request.form['exercise-name']
        return varss


if __name__ == "__main__":
    app.run(host=os.environ.get("IP"), 
    port=int(os.environ.get("PORT")), 
    debug=True)