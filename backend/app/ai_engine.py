import re

from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama

# 1. Initialize local LLM and Embeddings
llm = ChatOllama(model="llama3.1", temperature=0)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 2. Few-Shot Examples (Stored in ChromaDB for Semantic Retrieval)
examples = [
    {
        "question": "Show vessels near Mumbai Port.",
        "sql": "SELECT v.* FROM simulations v JOIN ports p ON v.origin_id = p.port_id WHERE p.name = 'Mumbai Port' AND v.status = 'active';",
    },
    {
        "question": "Which areas have wave heights above 4 meters?",
        "sql": "SELECT location, wave_height_m FROM marine_data_snapshots WHERE wave_height_m > 4.0;",
    },
    {
        "question": "Compare ocean temperatures over the past week.",
        "sql": "SELECT timestamp, ocean_temp_c FROM marine_data_snapshots WHERE timestamp >= NOW() - INTERVAL '7 days' ORDER BY timestamp;",
    },
]

# Create a local vector store for our few-shot examples
example_prompt = PromptTemplate(
    input_variables=["question", "sql"],
    template="User: {question}\nSQL: {sql}",
)
vectorstore = Chroma.from_texts(
    texts=[ex["question"] for ex in examples],
    embedding=embeddings,
    metadatas=[{"sql": ex["sql"]} for ex in examples],
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# 3. Strict Prompting constraints
DB_SCHEMA = """
Table: ports (port_id, name, location, country)
Table: simulations (sim_id, user_id, origin_id, dest_id, ship_type, status)
Table: marine_data_snapshots (snapshot_id, timestamp, location, wave_height_m, wind_speed_knots, is_unsafe)
"""

system_prompt = PromptTemplate(
    input_variables=["schema", "question"],
    template="""You are a PostgreSQL expert mapping questions to our schema.
    Output ONLY a valid, read-only SQL query. No markdown, no explanations.

    Schema:
    {schema}

    Question: {question}
    SQL:""",
)


# 4. Security Guardrail function
def sanitize_sql(query: str) -> str:
    """Hard validation layer to prevent destructive database queries."""
    query = query.strip().upper()
    forbidden_keywords = ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "TRUNCATE", "GRANT"]
    for keyword in forbidden_keywords:
        if re.search(rf"\b{keyword}\b", query):
            raise ValueError(f"Security Alert: Destructive keyword '{keyword}' is blocked.")
    return query


def generate_marine_sql(user_question: str) -> str:
    # Build the prompt dynamically with retrieved examples
    chain = system_prompt | llm | StrOutputParser()
    raw_sql = chain.invoke({"schema": DB_SCHEMA, "question": user_question})

    # Pass through our security guardrail before returning
    return sanitize_sql(raw_sql)
