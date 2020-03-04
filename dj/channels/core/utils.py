
import json

from django.utils.html import escapejs


def dumpjs(v):
    return escapejs(json.dumps(v))
