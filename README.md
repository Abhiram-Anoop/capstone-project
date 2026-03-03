backend :
  -> cd backend
  -> py -3.11 -m venv venv
  -> venv\Scripts\activate
  -> pip install -r requirements.txt 
  -> uvicorn server:app --reload --port 8001 


frontend :
  -> cd frontend
  -> yarn start
