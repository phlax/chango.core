
from django.utils.translation import trans_real

from bcp47 import bcp47


class BaseAcceptLangParser(object):

    def get_accept_lang(self, accept_lang_header, supported):
        headers = self.parse_accept_lang_header(accept_lang_header)

        for header in headers:
            # first check if the full lang code is supported
            if header[0] in supported:
                return header[0]

            # next check if lang itself is supported
            try:
                code = bcp47(header[0])
                if code.language in supported:
                    return code.language
            except:
                pass
        return 'en'

    def parse_accept_lang_header(self, lang_string):
        """
        Parse the lang_string, which is the body of an HTTP Accept-Language
        header, and return a tuple of (lang, q-value), ordered by 'q' values.
        Return an empty tuple if there are any format errors in lang_string.
        """
        result = []
        pieces = trans_real.accept_language_re.split(lang_string)
        if pieces[-1]:
            return ()
        for i in range(0, len(pieces) - 1, 3):
            first, lang, priority = pieces[i:i + 3]
            if first:
                return ()
            if priority:
                priority = float(priority)
            else:
                priority = 1.0
            result.append((lang, priority))
        result.sort(key=lambda k: k[1], reverse=True)
        return tuple(result)


class AcceptLangParser(BaseAcceptLangParser):

    def get_accept_lang(self, accept_lang_header, supported):
        headers = self.parse_accept_lang_header(accept_lang_header)

        for header in headers:
            # first check if the full lang code is supported
            if header[0] in supported:
                return header[0]

            # next check if lang itself is supported
            try:
                code = bcp47(header[0])
                if code.language in supported:
                    return code.language
            except:
                pass
        return 'en'
