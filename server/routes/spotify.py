from fastapi import APIRouter
from server.logic.spotify_tools import get_spotify_client

router = APIRouter()

@router.get("/spotify/token")
def get_spotify_token():
    try:
        sp = get_spotify_client()
        token_info = sp.auth_manager.get_access_token(as_dict=True)
        return {"access_token": token_info["access_token"]}
    except Exception as e:
        return {"error": str(e)}