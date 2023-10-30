from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import shutil
from datetime import datetime
import os
from pdf2text import get_text
from langchain.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

llm = Ollama(
    model="mistral", callback_manager=CallbackManager([StreamingStdOutCallbackHandler()])
)

app = FastAPI()

TEMP_DIR = "temp"

@app.post("/upload/")
async def upload_CV(file: UploadFile):
    try:
        if not os.path.exists(TEMP_DIR):
            os.mkdir(TEMP_DIR)

        new_filename = str(datetime.now().timestamp()) + file.filename
        temp_file_path = os.path.join(TEMP_DIR, new_filename)

        with open(temp_file_path, "wb") as temp_file:
            shutil.copyfileobj(file.file, temp_file)

        return JSONResponse(content={"filepath": new_filename})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/generate")
async def generate_cover_letters(cv_filepath: str, job_des_text: str):
    try:
        cv_text = get_text(os.path.join('temp',cv_filepath))
    except Exception as e:
        return JSONResponse(status_code=500,
                            content={"msg":"failed to get text from PDF",
                                     "cv_filepath": cv_filepath,
                                     "error": str(e)})
    res = llm("Generate a cover letter for the job description tailored to the CV " + job_des_text + cv_text)
    return res


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)