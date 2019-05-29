import os
from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")
    
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