from pathlib import Path
from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()


def api_guard(request: Request):
    token = request.headers.get("X-API-Key")
    if token != "secret":
        raise HTTPException(status_code=401, detail="Unauthorized")


api = APIRouter(prefix="/api", dependencies=[Depends(api_guard)])

app.include_router(api)

DIST_DIR = Path(__file__).parent.parent / "frontend" / "dist"
app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="spa")


@app.get("/{full_path:path}")
def spa_fallback(full_path: str):
    return FileResponse(DIST_DIR / "index.html")
