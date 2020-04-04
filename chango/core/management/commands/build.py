# -*- coding: utf-8 -*-
#
# Copyright (C) Xtle contributors.
#
# This file is a part of the Xtle project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

import os
import shutil
import subprocess

from django.conf import settings


from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Run webpack to create assets'

    def handle(self, **options):
        index_path = os.path.abspath("public/index.html")

        if not os.path.exists(index_path):
            if not os.path.exists(os.path.dirname(index_path)):
                os.mkdir(os.path.dirname(index_path))
            src_path = os.path.abspath(
                os.path.join(
                    __file__,
                    "../../../public/index.html"))
            shutil.copyfile(src_path, index_path)

        command = (
            "npm run watch -- -p /static/ -b %s"
            % settings.DJ_CHANNELS_ASSETS)
        command = (
            "npm run watch -- -p /static/ -b %s"
            % settings.DJ_CHANNELS_ASSETS)
        subprocess.call(command.split(" "))
