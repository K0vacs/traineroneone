import os, json, boto3, datetime, random, helpers
from flask import Flask, render_template, request, url_for, redirect
from flask_pymongo import PyMongo
from werkzeug.utils import secure_filename
from bson.json_util import dumps
from bson.objectid import ObjectId


app = Flask(__name__)
app.config["MONGO_DBNAME"] = 'TrainerOneOneDB'
app.config["MONGO_URI"] = os.getenv('MONGO_URI', 'mongodb://localhost')
mongo = PyMongo(app)


@app.route("/")
def programs():
    return  render_template("pages/programs.html", 
            programs  = mongo.db.programs.find(), 
            quote     = helpers.quote(random.randint(0, 5)), 
            title     = "Programs")


# @app.route("/workouts")
@app.route("/<id>")
def workouts(id):
  program = mongo.db.programs.find_one({'_id': ObjectId(id)})
  workouts = []
  
  for workoutId in json.loads(program["multiSelect"]):
    if workoutId is not "":
      workouts.append(ObjectId(workoutId))
    
  return  render_template("pages/workouts.html", 
          workout = mongo.db.workouts.find({'_id': {'$in': workouts}}),
          program = program,
          quote   = helpers.quote(random.randint(0, 5)), 
          title   = "Workouts")


# @app.route("/exercises")
@app.route("/<id>/<ex>")
def exercises(id, ex):
  workout = mongo.db.workouts.find_one({'_id': ObjectId(ex)})
  exerciseIds =  json.loads(workout["multiSelect"])
  exercises = []
  
  for exerciseId in exerciseIds:
    exercises.append(ObjectId(exerciseId))
  
  result = mongo.db.exercises.find({'_id': {'$in': exercises}})
  return  render_template("pages/exercises.html", 
          exercises = result, 
          workout   = workout,
          id        = id,
          quote     = helpers.quote(random.randint(0, 5)),
          title     = "Exercises")


@app.route("/program-form/", defaults={'category': 'none', 'id': 'new'}, methods=['GET', 'POST'])
@app.route("/program-form/<category>/<id>")
def program_form(category, id):
  if id == "new" and category == "none":
    return  render_template('pages/program-form.html',
            quote = helpers.quote(random.randint(0, 5)),
            title = "Program Form")
  else:
    itemRecord = mongo.db[category].find_one({'_id': ObjectId(id)})
    return  render_template('pages/program-form.html', 
            item=itemRecord, 
            quote = helpers.quote(random.randint(0, 5)),
            title = "Program Form")


@app.route("/delete-item/<category>/<id>", methods=['GET'])
def delete_item(category, id):
  try:
    result = mongo.db[category].find_one({'_id': ObjectId(id)})
    
    imageKey = result[category[:-1] + "Img"][45:]
    S3_BUCKET = os.environ.get('S3_BUCKET')
    s3 = boto3.client('s3')
    
    s3.delete_object(Bucket= S3_BUCKET, Key= imageKey )
    mongo.db[category].remove({'_id': ObjectId(id)})
    return redirect(url_for('programs'))
  except Exception as error:
    return redirect(url_for('programs'))




@app.route("/delete/", methods=['GET', 'POST'])
def delete():
  id = request.args.get('id')
  imgKey = request.args.get('img')
  S3_BUCKET = os.environ.get('S3_BUCKET')
  s3 = boto3.client('s3')
  
  try:
    s3.delete_object(Bucket= S3_BUCKET, Key= imgKey )
    mongo.db.exercises.remove({'_id': ObjectId(id)})
  except:
    return "An error occured when deleting this item, please try again."
  return "Deletion successful"
  
  
@app.route("/edit/", methods=['GET', 'POST'])
def edit():
  try:
    id = request.args.get('id')
    type = request.args.get('type') + "s"
    result = dumps(mongo.db[type].find({'_id': ObjectId(id)}))
    return result
  except Exception as error:
    return error


@app.route("/update/", methods=['GET', 'POST'])    
def update():
  data = request.form.to_dict()
  id = data['_id']
  del data['_id']
  
  if "exerciseName" in data:
    result = mongo.db.exercises.update({'_id': ObjectId(id)}, { "$set": data })
    return str(result)
  if "workoutName" in data:
    result = mongo.db.workouts.update({'_id': ObjectId(id)}, { "$set": data })
    return str(result)
  if "programName" in data:
    result = mongo.db.programs.update({'_id': ObjectId(id)}, { "$set": data })
    return str(result)
  if "toDelete" in data:
    S3_BUCKET = os.environ.get('S3_BUCKET')
    s3 = boto3.client('s3')
    result = s3.delete_object(Bucket= S3_BUCKET, Key= data["toDelete"] )
    return str(result)

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


@app.route("/save-form", methods=['POST'])
def save_form():
  if request.method == 'POST':
    data = request.form.to_dict()
    if "exerciseName" in data:
      result = mongo.db.exercises.insert_one(data)
      return str(result.inserted_id)
    if "workoutName" in data:
      result = mongo.db.workouts.insert_one(data)
      return str(result.inserted_id)
    if "programName" in data:
      result = mongo.db.programs.insert_one(data)
      return str(result.inserted_id)


@app.route("/load-select-options",  methods=['GET'])
def load_select_options():
  data = request.args.get('options')
  if data == "exercise":
    exercises = dumps(mongo.db.exercises.find({}, { '_id': 1, 'exerciseName': 1, 'imageUrl': 1 }))
    return exercises
  if data == "workout":
    workouts = dumps(mongo.db.workouts.find({}, { '_id': 1, 'workoutName': 1, 'imageUrl': 1 }))
    return workouts


if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True) 