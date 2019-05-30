import os
from flask import Flask, render_template, url_for, redirect, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)
app.config["MONGO_DBNAME"] = 'TrainerOneOneDB'
app.config["MONGO_URI"] = os.getenv('MONGO_URI', 'mongodb://localhost')

mongo = PyMongo(app)

@app.route("/")
def home():
    return render_template("home.html", tasks=mongo.db.TOOCollection.find())
    
@app.route("/workouts")
def workouts():
    return render_template("workouts.html")
    
@app.route("/excersises")
def excersises():
    return render_template("excersises.html")
    
if __name__ == "__main__":
    app.run(host=os.environ.get("IP"), 
    port=int(os.environ.get("PORT")), 
    debug=True)