import requests
from collections import defaultdict
import json

DIFFERENT_COURSE = -1

class MyEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__

class Course(object):
    def __init__(self):
        self.cid = ''
        self.title = ''
        self.terms = defaultdict(int)

class Subject(object):
    def __init__(self):
        self.sid = ''
        self.name = ''
        self.courses = []

def get_term(year, term):
    return requests.get("https://sis.rutgers.edu/soc/api/courses.gzip?year={}&term={}&campus=NB".format(year, term)).json()

if __name__ == "__main__":
    all_courses = defaultdict(lambda: Course())
    subjects = defaultdict(lambda: Subject())

    for year in reversed(range(2015, 2021)):
        for term in reversed([0, 1, 7, 9]):
            courses = get_term(year, term)
            semesterStr = '{}{}'.format(term, year)

            for course in courses:
                cid = course['courseString']
                current_title = all_courses[cid].title
                if current_title != '' and current_title != course['title']:
                    # the title of the course changed, so let's not count the past years.
                    all_courses[cid].terms[semesterStr] = DIFFERENT_COURSE
                    continue

                all_courses[cid].cid = cid
                all_courses[cid].title = course['title']
                all_courses[cid].terms[semesterStr] = len(course['sections'])

                if subjects[course['subject']].name == '':
                    subjects[course['subject']].sid = course['subject']
                    subjects[course['subject']].name = course['subjectDescription']

    # print(MyEncoder().encode(list(subjects.values())))
    for key, course in all_courses.items():
        sid = key.split(':')[1]
        subjects[sid].courses.append(course)
    
    all_subs = []
    for sid, subj in subjects.items():
        all_subs.append({"id": sid, "name": subj.name})
        with open('public/data/{}.json'.format(sid), 'w') as f:
            json.dump(subj, f, cls=MyEncoder)
    
    with open('public/data/subjects.json', 'w') as f:
        json.dump(all_subs, f)

