from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
#engine=create_engine("sqlite:///./test.db",connect_args={"check_same_thread":False})
engine = create_engine("mysql+pymysql://username:password@localhost:3306/database_name")
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base=declarative_base()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()