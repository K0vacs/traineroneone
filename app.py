import os, json, boto3, datetime
from flask import Flask, render_template, request, url_for
from flask_pymongo import PyMongo
from werkzeug.utils import secure_filename


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


@app.route("/add-program/")
def add_program():
  return render_template('add-program.html')


@app.route("/save-exercise", methods=['POST'])
def save_exercise():
  if request.method == 'POST':
    result = mongo.db.TOOCollection.insert_one({'exercise': request.form})
    return str(result.inserted_id)

@app.route('/sign-s3/')
def sign_s3():
  S3_BUCKET = os.environ.get('S3_BUCKET')
  s3 = boto3.client('s3')
  dateTimeNow = datetime.datetime.now()
  file_name = secure_filename(str(dateTimeNow) + request.args.get('file-name'))
  file_type = request.args.get('file-type')

  presigned_post = s3.generate_presigned_post(
    Bucket = S3_BUCKET,
    Key = file_name,
    Fields = {"acl": "public-read", "Content-Type": file_type},
    Conditions = [
      {"acl": "public-read"},
      {"Content-Type": file_type}
    ],
    ExpiresIn = 3600
  )

  return json.dumps({
    'data': presigned_post,
    'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
  })


if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)