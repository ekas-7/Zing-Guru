from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptAvailable, CouldNotRetrieveTranscript
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
if not os.getenv('GOOGLE_API_KEY'):
    print("Warning: GOOGLE_API_KEY not found in environment variables")
else:
    genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

class VideoURL(BaseModel):
    url: str
    language: str = "en"  # Default to English

def extract_transcript_text(youtube_video_url, language="en"):
    try:
        video_id = youtube_video_url.split("=")[1]
        
        try:
            # First attempt: Get transcript in requested language
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
        except (TranscriptsDisabled, NoTranscriptAvailable, CouldNotRetrieveTranscript):
            try:
                # Second attempt: Get transcript in any available language
                transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
                
                # Check if a manual transcript is available
                transcript = transcript_list.find_transcript([language])  # Get the transcript in the specified language
                if transcript is None:
                    # If the desired language transcript isn't available, fetch the first available transcript
                    transcript = transcript_list.find_transcript()
                transcript = transcript.fetch()
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Could not retrieve transcript: {str(e)}"
                )
        
        # Format transcript text
        formatter = TextFormatter()
        formatted_transcript = formatter.format_transcript(transcript)
        return formatted_transcript

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid YouTube URL. Please provide a valid video URL."
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing video: {str(e)}"
        )

def generate_summary(transcript_text, target_language):
    prompt = f"""
    You are a YouTube video summarizer. You understand any language but gives output in 
    English only with proper emojis used in your answer
    You will be taking the transcript text and 
    summarizing the entire video, providing the important summary in points 
    with full explanation in more than 500 words. Format the response with proper line breaks between points and in markodown format. 
    
    If the transcript text is in any language other than english, 
    first translate it into english before summarizing.
    

    The transcript text will be appended here:
    """
    
    try:
        model = genai.GenerativeModel("gemini-pro")
        response = model.generate_content(prompt + transcript_text)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/summarize")
async def summarize_video(video: VideoURL):
    try:
        transcript = extract_transcript_text(video.url, video.language)
        if not transcript:
            raise HTTPException(
                status_code=400,
                detail="Could not extract transcript from the video"
            )
            
        # Pass the target language (either "en" or "hi") to the generate_summary function
        summary = generate_summary(transcript, target_language=video.language)
        
        return {
            "summary": summary,
            "questions": [
                "What are the main points discussed in the video?",
                "How does this content relate to the broader context?",
                "What evidence is presented to support the main arguments?"
            ]
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"An unexpected error occurred: {str(e)}"
        )
        
@app.post("/api/generate-questions")
async def generate_questions(video: VideoURL):
    try:
        # Extract the transcript text first
        transcript = extract_transcript_text(video.url, video.language)
        if not transcript:
            raise HTTPException(
                status_code=400,
                detail="Could not extract transcript from the video"
            )
        
        # Define prompt for question generation
        prompt = f"""
        Generate 5 unique, thought-provoking questions based on the video transcript.
        Provide questions as a simple, straightforward list:
        1. First question
        2. Second question
        3. Third question
        4. Fourth question
        5. Fifth question

        Transcript:
        {transcript}
        """

        try:
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(prompt)
            
            # Clean and extract questions
            questions = []
            for line in response.text.split('\n'):
                line = line.strip()
                if line and any(line.startswith(str(i) + '.') for i in range(1, 6)):
                    # Remove the numbering
                    question = line.split('. ', 1)[1] if '. ' in line else line
                    questions.append(question)
            
            # Ensure exactly 5 questions
            while len(questions) < 5:
                questions.append(f"Generic question {len(questions) + 1}")
            
            return {
                "questions": questions[:5]  # Strictly return 5 questions as a list of strings
            }

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"An unexpected error occurred: {str(e)}"
        )