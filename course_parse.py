import requests
from collections import defaultdict
import json

DIFFERENT_COURSE = -1
FIRST_TERM = (2015, 7)
LAST_TERM = (2021, 1)

def gen_terms():
    y, t = FIRST_TERM
    while (y, t) <= LAST_TERM:
        yield (y, t)
        if t == 0: # winter
            t = 1
        elif t == 1: # spring
            t = 7
        elif t == 7: # summer
            t = 9
        elif t == 9: # fall
            t = 0
            y += 1

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
    terms = []

    # reverse so we make sure we get the latest names of the courses
    for (year, term) in reversed(list(gen_terms())):
        courses = get_term(year, term)
        termStr = '{}{}'.format(term, year)
        terms.append(termStr)

        for course in courses:
            cid = course['courseString']
            current_title = all_courses[cid].title
            if current_title != '' and current_title != course['title']:
                # the title of the course changed, so let's not count the past years.
                all_courses[cid].terms[termStr] = DIFFERENT_COURSE
                continue

            all_courses[cid].cid = cid
            all_courses[cid].title = course['title']
            all_courses[cid].terms[termStr] = len(course['sections'])

            if subjects[course['subject']].name == '':
                subjects[course['subject']].sid = course['subject']
                subjects[course['subject']].name = course['subjectDescription']

    for key, course in all_courses.items():
        sid = key.split(':')[1]
        subjects[sid].courses.append(course)
    
    all_subs = []
    for sid, subj in subjects.items():
        all_subs.append({"id": sid, "name": subj.name})
        subj.courses.sort(key=lambda x: x.cid)
        with open('public/data/{}.json'.format(sid), 'w') as f:
            json.dump(subj, f, cls=MyEncoder)
    
    with open('public/data/index.json', 'w') as f:
        index = {
            "subjects": sorted(all_subs, key=lambda x: x['id']),
            "availableTerms": list(reversed(terms))
        }
        json.dump(index, f)

