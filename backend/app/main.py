from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine,Base
from .routers import profiles, auth
Base.metadata.create_all(bind=engine)
app=FastAPI(title="SaaS Profile Manager")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
app.include_router(profiles.router,prefix="/profiles")
app.include_router(auth.router,prefix="/auth")
