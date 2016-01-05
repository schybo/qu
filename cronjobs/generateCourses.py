import os
from json import dumps
from uwaterlooapi import UWaterlooAPI
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
load_dotenv(dotenv_path)

uw = UWaterlooAPI(api_key=os.environ['UW_API_TOKEN'])

# If you need to see all the methods
# l = dir(uw)
# print l

subjects = uw.subject_codes()
allTermInfo = uw.terms()
terms = allTerms['listings']

# You kind want to update the coming term more than the other ones right?
print terms
for year in terms:
	for term in terms[year]:
		term = str(term['id'])
		print term
		courseMatches = []
		for subject in subjects:
			courses = uw.term_subject_schedule(term, subject['subject'])
			for course in courses:
				courseMatches.append(course)
		f = open('../data/' + term + '.json', 'w')
		f.write(dumps(courseMatches))