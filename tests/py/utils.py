
from unittest.mock import patch

from chango.core.utils import dumpjs


@patch("chango.core.utils.escapejs")
@patch("chango.core.utils.json")
def test_utils_dumpjs(m_json, m_escape):
    m_json.dumps.return_value = "JSON"
    m_escape.return_value = "ESCAPED STRING"
    result = dumpjs("JS")
    assert result == "ESCAPED STRING"
    assert (
        list(m_json.dumps.call_args)
        == [('JS',), {}])
    assert (
        list(m_escape.call_args)
        == [('JSON',), {}])
