from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from schemas import ProcessResponse 
from services.unstructured_services import process_file
from services.gemini_service import process_with_gemini
import logging
import os
from typing import Union


app = FastAPI(
    title="Document Processing API",
    description="API to extract and structure information from documents.",
    version="1.0.0"
)


origins = [
    "http://localhost:8080",
    "http://localhost:8080/api/documents/process"  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


SUPPORTED_FILE_TYPES = {
    "pdf": "application/pdf",
    "image": ["image/jpeg", "image/png", "image/tiff", "image/gif"], 
    "excel": [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ]
}

@app.post("/process-invoice", response_model=ProcessResponse, tags=["Document Processing"])
async def process_document(file: UploadFile = File(...)):
    """
    Endpoint to process uploaded documents (PDFs, Images, Excel files).
    Extracts text/data and processes it with Gemini LLM to generate structured information.
    """
    logger.info(f"Received file: {file.filename} with content type: {file.content_type}")
    
    file_type = None
    if file.content_type == SUPPORTED_FILE_TYPES["pdf"]:
        file_type = "pdf"
    elif file.content_type in SUPPORTED_FILE_TYPES["image"]:
        file_type = "image"
    elif file.content_type in SUPPORTED_FILE_TYPES["excel"]:
        file_type = "excel"
    else:
        logger.warning("Invalid file type uploaded.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDFs, images, and Excel files are supported."
        )

    try:
       
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        logger.info(f"Saved uploaded file to: {file_path}")    

       
        if os.path.getsize(file_path) > MAX_FILE_SIZE:
            logger.warning("Uploaded file exceeds the maximum allowed size.")
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File size exceeds the 10 MB limit."
            )

        
        logger.info(f"Processing {file_type} file: {file.filename}")
        structured_data = process_file(file_path, file_type)
        logger.info("Successfully extracted text and structured data.")
       
        final_data = process_with_gemini(structured_data)
        logger.info("Successfully processed data with Gemini LLM.")

    except HTTPException as he:
        logger.error(f"HTTPException: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Error processing file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process document."
        )
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                logger.info(f"Removed uploaded file: {file_path}")
            except PermissionError as pe:
                logger.error(f"PermissionError while removing file: {pe}")
            except Exception as e:
                logger.error(f"Unexpected error while removing file: {e}")

    return ProcessResponse(data=final_data)







