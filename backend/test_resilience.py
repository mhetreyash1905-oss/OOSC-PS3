from types import SimpleNamespace

import pytest

from app.agents.rights_navigator import _knowledge_base_fallback
from app.firebase_admin_config import verify_firebase_token


def test_rights_fallback_is_grounded_and_low_confidence():
    chunk = SimpleNamespace(
        source_document="test-law.md",
        section_title="Section 1",
        text="Relevant statutory text.",
    )

    result = _knowledge_base_fallback([chunk])

    assert result["confidence"] == "low"
    assert result["citations"][0]["full_chunk_text"] == chunk.text
    assert "not a substitute for a lawyer" in result["explanation"]


def test_invalid_firebase_token_is_rejected(monkeypatch):
    from app import firebase_admin_config

    monkeypatch.setattr(firebase_admin_config.auth, "verify_id_token", lambda token: (_ for _ in ()).throw(Exception("invalid")))
    monkeypatch.setattr(firebase_admin_config, "_allow_unverified_dev_tokens", False)

    with pytest.raises(ValueError):
        verify_firebase_token("invalid-token")
