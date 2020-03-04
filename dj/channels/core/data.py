

class Data(object):

    def __init__(self, user, path, kwargs, headers, page=False):
        self.user = user
        self.path = path
        self.kwargs = kwargs
        self.headers = headers
        self.page = page

    def get_data(self):
        context = dict(route=self.path, data={"__schema__": {}})
        if self.page and not self.user.is_anonymous:
            context["user"] = dict(
                username=self.user.username,
                isanon=self.user.is_anonymous)
        return context
