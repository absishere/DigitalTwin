from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app import schemas
from app.ai_engine import generate_marine_sql

router = APIRouter()

@router.post("/query", response_model=schemas.AIQueryRes)
def ask_marine_assistant(req: schemas.AIQueryReq, db: Session = Depends(get_db)):
    try:
        # 1. Convert natural language to SQL via LangChain + Ollama
        sql_query = generate_marine_sql(req.query).strip()
        
        # 2. Execute the read-only query safely
        result = db.execute(text(sql_query))
        rows = [dict(row._mapping) for row in result.fetchall()]
        
        # 3. Determine visualization type to return to the dashboard
        viz_type = "table"
        if "location" in sql_query.lower() or "st_" in sql_query.lower():
            viz_type = "map"
        elif "temp" in sql_query.lower() or "wave" in sql_query.lower():
            viz_type = "chart"

        return {
            "text_answer": f"Successfully retrieved data for: {req.query}",
            "sql_used": sql_query,
            "viz_type": viz_type,
            "data": rows
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"AI query failed: {str(e)}")