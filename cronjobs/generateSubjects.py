import os
from json import dumps
from uwaterlooapi import UWaterlooAPI
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path)

uw = UWaterlooAPI(api_key=os.environ['UW_API_TOKEN'])

subjects = uw.subject_codes()
f = open('../data/subjects.json', 'w')
f.write(dumps(subjects))