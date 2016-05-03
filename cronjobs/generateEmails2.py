import os
import psycopg2
import urlparse

from mailin import Mailin
from uwaterlooapi import UWaterlooAPI

# Setup Waterloo connection
# uw = UWaterlooAPI(api_key=os.environ['UW_API_TOKEN'])
uw = UWaterlooAPI(api_key="294d50dbcdbd23e09069c1656baa0aaf")
m = Mailin("https://api.sendinblue.com/v2.0","DcF3tRBPv7Jh6Oqx")

# If you need to see all the methods
# l = dir(uw)
# print l

# Connect to database
urlparse.uses_netloc.append("postgres")
# url = urlparse.urlparse(os.environ["DATABASE_URL"])
url = urlparse.urlparse("postgres://ngndzviyttjnwl:4cpewCb0hqlGUYw-PWD1q9e8T2@ec2-107-20-153-141.compute-1.amazonaws.com/d5hq8rfs6clqki")

conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)

cur = conn.cursor()
try:
    cur.execute("""SELECT * from Subscriptions""")
except:
    print "Cursor can't SELECT from Subscriptions"

# Is course number unique for course & term or not?
rows = cur.fetchall()
for row in rows:
	# Id, Course, Email
	# 0 , 1     , 2
	print row[1]
	course = uw.schedule_by_class_number(row[1])
	course = course[0] if course else None
	print course
	if course and (course['enrollment_total'] >= course['enrollment_capacity']):
		print "Course now open!"
		#Send email
		try:
			message = {
				"from" : ['info@uwcourses.com' ,"UW Courses"],
				'html': '<p>Hey!</p><p>You know that course you subscribed to: ' + str(row[2]) + '?</p><p>Well it has opened up!</p><p>Best of luck getting it!</p>',
				'headers': {'website': 'www.uwcourses.com'},
				'text': 'Hey! You know that course you subscribed to with course number ' + str(row[2]) + '? Well it has opened up! Best of luck getting it!',
				"to" : { row[3] : row[3] },
				'subject': str(row[1]) + ' Course Opening'
			}

			result = m.send_email(message)
			print(result)

		    # message = {
		    #  'from_email': 'info@uwcourses.com',
		    #  'from_name': 'UW Courses',
		    #  'html': '<p>Hey!</p><p>You know that course you subscribed to: ' + str(row[2]) + '?</p><p>Well it has opened up!</p><p>Best of luck getting it!</p>',
		    #  'metadata': {'website': 'www.uwcourses.com'},
		    #  'to': [{'email': row[3],'type': 'to'}],
		    #  'text': 'Hey! You know that course you subscribed to with course number ' + str(row[2]) + '? Well it has opened up! Best of luck getting it!',
		    #  'subject': str(row[1]) + ' Course Opening'
		    # }
		    # result = mandrill_client.messages.send(message=message)
		    # print "Sent email!"

		except Exception as e:
		    # Mandrill errors are thrown as exceptions
		    print 'An error occurred: %s - %s' % (e.__class__, e)

		#Remove from list
		try:
			cur.execute("DELETE FROM Subscriptions WHERE ClassNumber = %s AND Email = %s", (row[1], row[3]))
			print "Deleted the item from Subscriptions"
		except Exception as e:
			print e

	# Commit changes to DB
	conn.commit()





