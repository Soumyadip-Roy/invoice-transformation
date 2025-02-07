import os
import logging
from typing import Dict, List, Any, Union
from PIL import Image
import pytesseract
import pandas as pd
from unstructured.partition.pdf import partition_pdf
from unstructured.documents.elements import Element

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

OUTPUT_PATH = "output_images"
IMAGE_OUTPUT_PATH = "output_processed_images"
os.makedirs(OUTPUT_PATH, exist_ok=True)
os.makedirs(IMAGE_OUTPUT_PATH, exist_ok=True)


def extract_text_from_image(file_path: str) -> str:

    try:
        logger.info(f"Processing image file: {file_path}")
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        logger.info("Text extraction from image completed.")
        return text
    except Exception as e:
        logger.error(f"Error during image OCR processing: {e}")
        raise RuntimeError(f"Failed to process image file: {e}")


def process_image(file_path: str) -> Dict:
    try:
        text = extract_text_from_image(file_path)
        
        structured_data = {
            "text_blocks": [text.strip()] if text.strip() else [],
            "images": [file_path]
        }
        logger.info(f"Processed structured data for image: {structured_data}")
        return structured_data
    except Exception as e:
        logger.error(f"Error processing image file: {e}")
        raise


def extract_data_from_excel(file_path: str) -> Dict[str, pd.DataFrame]:
    try:
        logger.info(f"Processing Excel file: {file_path}")
        with pd.ExcelFile(file_path, engine='openpyxl') as xls:
            sheets = xls.sheet_names
            data = {}
            for sheet in sheets:
                df = pd.read_excel(xls, sheet_name=sheet)
                data[sheet] = df
                logger.info(f"Extracted sheet '{sheet}' with {df.shape[0]} rows and {df.shape[1]} columns.")
        return data
    except Exception as e:
        logger.error(f"Error during Excel file processing: {e}")
        raise RuntimeError(f"Failed to process Excel file: {e}")

def process_excel(file_path: str) -> Dict:
    try:
        data = extract_data_from_excel(file_path)
        structured_data = {
            "sheets": {}
        }

        for sheet_name, df in data.items():
            df_cleaned = df.dropna(how='all')
            # Convert DataFrame to list of dictionaries
            records = df_cleaned.to_dict(orient='records')
            structured_data["sheets"][sheet_name] = records

        logger.info(f"Processed structured data for Excel: {structured_data}")
        return structured_data
    except Exception as e:
        logger.error(f"Error processing Excel file: {e}")
        raise

def extract_text_from_pdf(file_path: str) -> List[Element]:
    try:
        logger.info(f"Processing PDF file: {file_path}")
        elements = partition_pdf(
            filename=file_path,
            strategy="auto",
            extract_images_in_pdf=True,
            extract_image_block_types=["Image", "Table"],
            chunking_strategy="by_title",
            max_characters=4000,
            new_after_n_chars=3800,
            combine_text_under_n_chars=2000,
            image_output_dir_path=OUTPUT_PATH,
        )
        logger.info(f"Extracted {len(elements)} elements from the PDF.")
        return elements
    except Exception as e:
        logger.error(f"Error during PDF processing: {e}")
        raise RuntimeError(f"Failed to process PDF file: {e}")

def process_raw_elements(elements: List[Element]) -> Dict:
    structured_data = {
        "text_blocks": [],
        "tables": [],
        "images": []
    }

    for element in elements:
        element_type = str(type(element))
       
        if "CompositeElement" in element_type:
            text_content = getattr(element, 'text', '').strip()
            if text_content:
                structured_data["text_blocks"].append(text_content)
   
        elif "Table" in element_type:
            table_content = getattr(element, 'text', '').strip()
            if table_content:
                structured_data["tables"].append(table_content)

        elif "Image" in element_type:
            image_path = getattr(element, 'image_path', '')
            if image_path:
                structured_data["images"].append(image_path)

    logger.info(f"Processed structured data for PDF: {structured_data}")
    return structured_data


def extract_text_file(file_path: str, file_type: str) -> Union[List[Any], Dict]:
    
    if file_type.lower() == 'pdf':
        elements = extract_text_from_pdf(file_path)
        return process_raw_elements(elements)
    elif file_type.lower() == 'image':
        return process_image(file_path)
    elif file_type.lower() == 'excel':
        return process_excel(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")

def process_file(file_path: str, file_type: str) -> Dict:
    try:
        logger.info(f"Starting processing for {file_type} file: {file_path}")
        structured_data = extract_text_file(file_path, file_type)
        logger.info(f"Completed processing for {file_type} file: {file_path}")
        return structured_data
    except Exception as e:
        logger.error(f"Error processing {file_type} file '{file_path}': {e}")
        raise
