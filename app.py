# Libraries required to execute the below code.
import os, json, boto3, datetime, random, helpers
from flask import Flask, render_template, request, url_for, redirect
from flask_pymongo import PyMongo
from werkzeug.utils import secure_filename
from bson.json_util import dumps
from bson.objectid import ObjectId

# Config variables required for the application.
app = Flask(__name__)
app.config["MONGO_DBNAME"] = 'TrainerOneOneDB'
app.config["MONGO_URI"] = os.getenv('MONGO_URI', 'mongodb://localhost')
mongo = PyMongo(app)

# Home route to display the home page of the application.
@app.route("/")
def programs():
    return  render_template("pages/programs.html", 
            programs  = mongo.db.programs.find(), 
            quote     = helpers.quote(random.randint(0, 5)))

# Workouts route to display all workouts associated with a program.
@app.route("/<programId>")
def workouts(programId):
  program = mongo.db.programs.find_one({'_id': ObjectId(programId)})
  workouts = []
  
  for workoutId in json.loads(program["multiSelect"]):
    if workoutId is not "":
      workouts.append(ObjectId(workoutId))
    
  return  render_template("pages/workouts.html", 
          workout = mongo.db.workouts.find({'_id': {'$in': workouts}}),
          program = program,
          quote   = helpers.quote(random.randint(0, 5)))

# Exercises route to display all exercises associated with a workout.
@app.route("/<programId>/<workoutId>")
def exercises(programId, workoutId):
  workout     = mongo.db.workouts.find_one({'_id': ObjectId(workoutId)})
  exercises   = []
  
  for exerciseId in json.loads(workout["multiSelect"]):
    if exerciseId is not "":
      exercises.append(ObjectId(exerciseId))
  
  result = list(mongo.db.exercises.find({'_id': {'$in': exercises}}))
  muscleGroups = []
  
  for item in result:
    for muscle in json.loads(item["multiSelect"]):
      if muscle != "":
        if muscle not in muscleGroups:
          muscleGroups.append(muscle)
    
  meta = mongo.db.exercises.aggregate([ 
    { "$match" : { "_id" : {'$in': exercises} } }, 
    { "$group": { "_id": "0", 
      "durationSum": { "$sum": "$exerciseDuration" },
      "difficultySum": { "$sum": "$exerciseDifficulty" },
      "count": { "$sum": 1 } } 
    }
  ]);
  
  return  render_template("pages/exercises.html", 
          exercises     = result,
          muscleGroups  = muscleGroups,
          workout       = workout,
          meta          = list(meta),
          quote         = helpers.quote(random.randint(0, 5)))

# Program form route to allow the user to create and edit programs, workouts and exercises.
@app.route("/program-form/", 
  defaults={'category': 'none', 'id': 'new'}, 
  methods=['GET', 'POST'])

@app.route("/program-form/<category>/<id>")
def program_form(category, id):
  if id == "new" and category == "none":
    return  render_template('pages/program-form.html',
            quote = helpers.quote(random.randint(0, 5)),
            title = "Program Form")
  else:
    return  render_template('pages/program-form.html', 
            item  = mongo.db[category].find_one({'_id': ObjectId(id)}), 
            quote = helpers.quote(random.randint(0, 5)))

# Delete route to allow users to delete programs, workouts and exercises from card view.
@app.route("/delete-item/<category>/<id>", methods=['GET'])
def delete_item(category, id):
  try:
    item = mongo.db[category].find_one({'_id': ObjectId(id)})
    mongo.db[category].remove({'_id': ObjectId(id)})
    
    boto3.client('s3').delete_object(
      Bucket  = os.environ.get('S3_BUCKET'), 
      Key     = item[category[:-1] + "Img"][45:] 
    )
    
    return redirect(request.referrer)
    
  except Exception:
    return redirect(request.referrer)

# Delete route to allow users to delete programs, workouts and exercises from program form view.
@app.route("/delete/", methods=['GET', 'POST'])
def delete():
  try:
    mongo.db[request.args.get('type')].remove({'_id': ObjectId(request.args.get('id'))})
    
    boto3.client('s3').delete_object(
      Bucket  = os.environ.get('S3_BUCKET'), 
      Key     = request.args.get('img')
    )
    
    return "Deletion successful"
    
  except:
    return "An error occured while deleting this item, please try again."
  
# Edit route to allow users to view to edit programs, workouts and exercises from program form view.
@app.route("/edit/", methods=['GET', 'POST'])
def edit():
  try:
    id = request.args.get('id')
    type = request.args.get('type') + "s"
    result = dumps(mongo.db[type].find({'_id': ObjectId(id)}))
    
    return result
  except Exception as error:
    return error

# Update route to allow users to save updated to programs, workouts and exercises from the program form view.
@app.route("/update/", methods=['GET', 'POST'])    
def update():
  data = request.form.to_dict()
  id = data['_id']
  del data['_id']
  
  if "toDelete" in data:
    boto3.client('s3').delete_object(
      Bucket= os.environ.get('S3_BUCKET'), 
      Key= data["toDelete"] )
    
  if "exerciseName" in data:
    data["exerciseDuration"] = int(data.get("exerciseDuration"))
    data["exerciseDifficulty"] = int(data.get("exerciseDifficulty"))
    item = mongo.db.exercises.update({'_id': ObjectId(id)}, { "$set": data })
    return str(item)
    
  elif "workoutName" in data:
    item = mongo.db.workouts.update({'_id': ObjectId(id)}, { "$set": data })
    return str(item)
    
  else:
    item = mongo.db.programs.update({'_id': ObjectId(id)}, { "$set": data })
    return str(item)

# AWS S3 Upload route to allow users to upload images to programs, workouts and exercises.
@app.route('/sign-s3/')
def sign_s3():
  S3_BUCKET   = os.environ.get('S3_BUCKET')
  dateTimeNow = datetime.datetime.now()
  file_name   = secure_filename(str(dateTimeNow) + request.args.get('file-name'))
  file_type   = request.args.get('file-type')

  presigned_post  = boto3.client('s3').generate_presigned_post(
    Bucket      = S3_BUCKET,
    Key         = file_name,
    Fields      = {"acl": "public-read", "Content-Type": file_type},
    Conditions  = [
      {"acl": "public-read"},
      {"Content-Type": file_type}
    ],
    ExpiresIn = 3600
  )

  return json.dumps({
    'data': presigned_post,
    'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
  })

# Save form route to allow users to save input data from the program form into MongoDB.
@app.route("/save-form", methods=['POST'])
def save_form():
  if request.method == 'POST':
    data = request.form.to_dict()
      
    if "exerciseName" in data:
      data["exerciseDuration"] = int(data.get("exerciseDuration"))
      data["exerciseDifficulty"] = int(data.get("exerciseDifficulty"))
      result = mongo.db.exercises.insert_one(data)
      
    elif "workoutName" in data:
      result = mongo.db.workouts.insert_one(data)
      
    else:
      result = mongo.db.programs.insert_one(data)
    
    return str(result.inserted_id)

# Load select options route loads all available workout and exercise options in the program form.
@app.route("/load-select-options",  methods=['GET'])
def load_select_options():
  data = request.args.get('options') + "s"
  if "exercises" in data: 
    item = dumps(mongo.db[data].find({}, { '_id': 1, 'exerciseName': 1, 'imageUrl': 1 }))
  else:
    item = dumps(mongo.db[data].find({}, { '_id': 1, 'workoutName': 1, 'imageUrl': 1 }))
  return item

# This function sets the IP and PORT for the application to run on and debugs when running on local.
if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True) 