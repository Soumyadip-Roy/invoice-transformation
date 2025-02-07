from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from utils.config import settings, logger
import json

llm = ChatGoogleGenerativeAI(
    model="gemini-pro",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.7,
)

prompt_template = """
You are an assistant that creates well-structured data from the provided text.

{input_data}

Please generate the response **strictly** in the following JSON format. All fields must be present; 
use `null` for missing values and if the input_data is containing more then one value for the specific field please collect all of them and use `\n` for them to segregate:
{{
    "invoice_id": "string",
    "GSTIN": "string",
    "date": "YYYY-MM-DD",
    "product_name": "string",
    "qty": integer,
    "tax": float,
    "total_amount": float,
    "unit_price": float,
    "customer_name": "string",
    "phone_number": "string",
    "email": "string",
    "address": "string"
}}

Rules:
1. The response must only include these fields.
2. If data is missing, set the value as `null`.
3. Maintain proper JSON syntax.
4. dict should only contain the 'text' field not the 'input_data' fields
"""

prompt = PromptTemplate.from_template(prompt_template)

qa_chain = LLMChain(llm=llm, prompt=prompt)

def validate_response(data: dict, required_keys: set) -> None:
    """
    Validates that all required keys are present in the LLM response.
    Raises an error if any key is missing.

    :param data: The JSON response from the LLM.
    :param required_keys: A set of required keys.
    """
    missing_keys = required_keys - set(data.keys())
    if missing_keys:
        raise ValueError(f"Missing required keys: {missing_keys}")


def process_with_gemini(raw_text: str) -> dict:
    """
    Processes raw text using Gemini LLM and validates the response.

    :param raw_text: Extracted text from the document.
    :return: Structured JSON data.
    """
    try:
        logger.info("Sending request to Gemini LLM through LangChain.")

        result = qa_chain.invoke({"input_data": raw_text})
        logger.debug(f"Gemini raw response: {result}")
        print(f"Gemini raw response: {result}")

        if isinstance(result, dict) and "text" in result:
            # Extract the `text` field
            json_text = result["text"]


            json_text = json_text.strip("```json").strip("```").strip()

            try:
                structured_output = json.loads(json_text)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to decode JSON from `text`. Raw text: {json_text}")
                raise ValueError("Invalid JSON format in the `text` field.") from e
        elif isinstance(result, dict):
            # If it's already a dictionary, use it as-is
            structured_output = result
        else:
            logger.error(f"Unexpected Gemini response type: {type(result)}")
            raise TypeError("Unexpected Gemini response type.")

        # Validate required keys
        required_keys = {
            "invoice_id", "GSTIN", "date", "product_name", "qty", "tax",
            "total_amount", "unit_price", "customer_name",
            "phone_number", "email", "address"
        }
        validate_response(structured_output, required_keys)

        logger.info("Successfully processed structured data.")
        return structured_output

    except ValueError as ve:
        logger.error(f"Validation error: {ve}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error in processing Gemini response: {e}")
        raise
