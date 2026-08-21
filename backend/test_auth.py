from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register():
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "password123", "confirm_password": "password123"}
    )
    print("Register Response:", response.status_code, response.json())

def test_login():
    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "password123"}
    )
    print("Login Response:", response.status_code, response.json())

if __name__ == "__main__":
    test_register()
    test_login()
