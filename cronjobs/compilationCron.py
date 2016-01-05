import os
from json import dumps
from uwaterlooapi import UWaterlooAPI
# from dotenv import load_dotenv
from apscheduler.schedulers.blocking import BlockingScheduler

sched = BlockingScheduler()

# dotenv_path = os.path.join(os.path.dirname(__file__), '../.env')
# load_dotenv(dotenv_path)

uw = UWaterlooAPI(api_key=os.environ['UW_API_TOKEN'])

subjects = uw.subject_codes()
allTermInfo = uw.terms()
terms = allTerms['listings']

# Cronjob for current term courses
@sched.scheduled_job('cron', day_of_week='mon-sat', hour=17)
def generateCoursesForCurrentTerm():
	print "Generating courses for current term"
	courseMatches = []
	term = str(allTermInfo.current_term)
	for subject in subjects:
		courses = uw.term_subject_schedule(allTermInfo.current_term, subject['subject'])
		for course in courses:
			courseMatches.append(course)
	f = open('../data/' + term + '.json', 'w')
	f.write(dumps(courseMatches))
	print "Finished generating courses for current term"

# Cronjob for all terms courses
@sched.scheduled_job('cron', day_of_week='sun', hour=17)
def generateCoursesForAllTerms():
	print "Generating courses for all terms"
	for year in terms:
		for term in terms[year]:
			term = str(term['id'])
			courseMatches = []
			for subject in subjects:
				courses = uw.term_subject_schedule(term, subject['subject'])
				for course in courses:
					courseMatches.append(course)
			f = open('../data/' + term + '.json', 'w')
			f.write(dumps(courseMatches))
	print "Finished generating courses for all terms"

@sched.scheduled_job('cron', day_of_week='sun', hour=18)
def generateSubjects():
	print "Generating subjects"
	subjects = uw.subject_codes()
	f = open('../data/subjects.json', 'w')
	f.write(dumps(subjects))
	print "Finished generating subjects"

@sched.scheduled_job('cron', day_of_week='sun', hour=19)
def generateTerms():
	print "Generating terms"
	terms = uw.terms()
	f = open('../data/terms.json', 'w')
	f.write(dumps(terms))
	print "Finished generating terms"

sched.start()