from langchain_ollama import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
import chromadb

# Initialize the local LLM with temperature 0 for deterministic SQL generation
llm = ChatOllama(model="llama3.1", temperature=0)

# Define our strict database schema constraint
DB_SCHEMA = """
Table: ports (port_id, name, location, country)
Table: simulations (sim_id, user_id, origin_id, dest_id, ship_type, status, current_eta)
Table: marine_data_snapshots (snapshot_id, timestamp, location, wave_height_m, wind_speed_knots, wind_direction_deg, ocean_temp_c, is_unsafe)
"""

# The strict prompt template that forces the LLM to output ONLY valid SQL
sql_prompt = PromptTemplate.from_template(
    """You are a PostgreSQL expert and a marine data assistant.
    Given the following database schema, write a safe, read-only SQL SELECT query that answers the user's question.
    DO NOT execute destructive queries (INSERT, UPDATE, DELETE).
    Return ONLY the SQL query string, nothing else. Do not format with markdown blocks.

    Schema:
    {schema}

    Question: {question}
    SQL Query:"""
)

# Build the LangChain pipeline
sql_chain = (
    {"schema": lambda _: DB_SCHEMA, "question": RunnablePassthrough()}
    | sql_prompt
    | llm
    | StrOutputParser()
)

def generate_marine_sql(natural_language_query: str) -> str:
    """Converts a natural language question into a constrained SQL query."""
    # This chain will safely translate queries like:
    # "Which areas have wave heights above 4 meters?" 
    return sql_chain.invoke(natural_language_query)