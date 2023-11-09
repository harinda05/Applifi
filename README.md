# applifi
Large Language Model (LLM) driven automated cover letter generator for job advertisements

## run backend
1. build a virtual environment: `python -m venv venv` or `python3 -m venv venv`
2. activate it `venc\Scripts\activate` (for windows), `source venv\bin\activate` (for linux)
3. install packages: `pip install -r requirements.txt`
4. `cd` to backend and run backend: `uvicorn main:app --reload`. the `main` refers to the python file to run, `app` refers to a FastAPI server object.