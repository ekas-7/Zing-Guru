from fastapi import FastAPI, HTTPException
import os
from langchain_community.document_loaders import TextLoader
from langchain_ollama import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Get API key from environment variables
groq_api_key = os.environ['GROQ_API_KEY']

# FastAPI app setup
app = FastAPI()

# Initialize embeddings
embeddings = OllamaEmbeddings(model="llama3")

# Initialize an empty FAISS vector store (No initial data)
vector_store = None  

# Initialize LLM
llm = ChatGroq(
    groq_api_key=groq_api_key,
    model_name="Deepseek-R1-Distill-Llama-70b"
)

# Set up a ChatPromptTemplate
prompt = ChatPromptTemplate.from_messages([
    ("system", """
    Answer the question based on the provided context only.
    Please provide the most accurate response based on the question.
    
    Context: {context}
    """),
    ("user", "{input}")
])

# Create the document chain
document_chain = create_stuff_documents_chain(llm, prompt)

@app.post("/add_text/")
def add_text(text: str):
    """Adds new text input to the FAISS vector store."""
    global vector_store
    try:
        # Process text input directly
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=20)
        final_documents = text_splitter.split_text(text)
        
        # Convert documents to vectors
        new_vectors = FAISS.from_texts(final_documents, embeddings)
        
        if vector_store is None:
            vector_store = new_vectors
        else:
            vector_store.merge_from(new_vectors)
        
        return {"message": "Text added successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding text: {e}")

@app.post("/get_response/")
def get_response(input_text: str):
    """Takes input text and returns a response using the retrieval chain."""
    global vector_store
    if vector_store is None:
        raise HTTPException(status_code=400, detail="No data available in vector store. Add text first.")
    
    try:
        retriever = vector_store.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)
        
        start = time.time()
        response = retrieval_chain.invoke({"input": input_text})
        end = time.time()
        
        return {"response": response['answer'], "response_time": f"{end - start:.2f} seconds"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {e}")
